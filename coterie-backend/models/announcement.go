package models

import (
	"database/sql"
	"log"
)

type Announcement struct {
	ID             int    `json:"id,omitempty"`
	Header         string `json:"header,omitempty"`
	Description    string `json:"description,omitempty"`
	Date           string `json:"date,omitempty"`
	CreatedAt      string `json:"created_at,omitempty"`
	UpdatedAt      string `json:"updated_at,omitempty"`
	OrganizationID int    `json:"organization_id,omitempty"`
}

type AnnouncementTable struct {
	DB *sql.DB
}

func NewAnnouncementTable(db *sql.DB) *AnnouncementTable {
	stmt, _ := db.Prepare(`
		CREATE TABLE IF NOT EXISTS "announcement" (
			"ID"	INTEGER NOT NULL UNIQUE,
			"header"	TEXT,
			"description"	TEXT,
			"date"	TEXT,
			"created_at"	TEXT,
			"updated_at"	TEXT,
			"organization_id"	INTEGER,
			FOREIGN KEY("organization_id") REFERENCES "organization"("ID"),
			PRIMARY KEY("ID" AUTOINCREMENT)
		);
	`)

	stmt.Exec()

	defer stmt.Close()

	return &AnnouncementTable{
		DB: db,
	}
}

//AnnouncementsLister grabs all the announcements for an org.
func (announcementTable *AnnouncementTable) AnnouncementsLister(orgID string) ([]Announcement, error) {
	announcements := []Announcement{}
	rows, err := announcementTable.DB.Query(`
		SELECT * FROM announcement WHERE announcement.organization_id = ?
	`, orgID)
	if err != nil {
		log.Printf("Unable to retrieve announcements: %s", err.Error())
		return nil, err
	}
	defer rows.Close()

	var id int
	var header string
	var description string
	var date string
	var createdAt string
	var updatedAt string
	var organizationID int
	for rows.Next() {
		rows.Scan(&id, &header, &description, &date, &createdAt, &updatedAt, &organizationID)
		announcement := Announcement{
			ID:             id,
			Header:         header,
			Description:    description,
			Date:           date,
			CreatedAt:      createdAt,
			UpdatedAt:      updatedAt,
			OrganizationID: organizationID,
		}
		announcements = append(announcements, announcement)
	}
	return announcements, nil
}

//Model.where(id: "")
func (announcementTable *AnnouncementTable) AnnouncementGetter(announcementID string) (Announcement, error) {
	var announcement Announcement

	stmt, err := announcementTable.DB.Prepare(`
		SELECT * FROM announcement WHERE id = ?
	`)
	if err != nil {
		log.Printf("Invalid sql query: %s", err.Error())
		return Announcement{}, err
	}
	defer stmt.Close()

	if stmt != nil {
		var id int
		var header string
		var description string
		var date string
		var createdAt string
		var updatedAt string
		var organizationID int

		err = stmt.QueryRow(announcementID).Scan(&id, &header, &description, &date, &createdAt, &updatedAt, &organizationID)
		if err != nil {
			log.Printf("Unable to retrieve announcement: %s", err.Error())
			return Announcement{}, err
		}

		announcement.ID = id
		announcement.Header = header
		announcement.Description = description
		announcement.Date = date
		announcement.CreatedAt = createdAt
		announcement.UpdatedAt = updatedAt
		announcement.OrganizationID = organizationID
	}
	return announcement, nil
}

//Model.create
func (announcementTable *AnnouncementTable) AnnouncementAdder(announcement Announcement) (Announcement, error) {
	stmt, err := announcementTable.DB.Prepare(`
		INSERT INTO announcement (header,description,date,created_at,updated_at,organization_id) VALUES (?,?,?,?,?,?)
	`)
	if err != nil {
		log.Printf("Bad Query: %s", err.Error())
		return Announcement{}, err
	}

	_, err = stmt.Exec(announcement.Header, announcement.Description, announcement.Date, announcement.CreatedAt, announcement.UpdatedAt, announcement.OrganizationID)

	if err != nil {
		log.Printf("Unable to create announcement: %s", err.Error())
		return Announcement{}, err
	}
	defer stmt.Close()

	return announcement, nil
}

//Model.update
func (announcementTable *AnnouncementTable) AnnouncementUpdater(announcement Announcement) (Announcement, error) {
	stmt, err := announcementTable.DB.Prepare(`
	UPDATE announcement SET header = ?, description = ?, date = ?, updated_at = ? WHERE announcement.id = ?
	`)
	if err != nil {
		log.Printf("Bad Query: %s", err.Error())
		return Announcement{}, err
	}
	defer stmt.Close()

	_, err = stmt.Exec(announcement.Header, announcement.Description, announcement.Date, announcement.UpdatedAt, announcement.ID)

	if err != nil {
		log.Printf("Unable to update announcement: %s", err.Error())
		return Announcement{}, err
	}
	return announcement, nil
}

//Model.delete
func (announcementTable *AnnouncementTable) AnnouncementDeleter(announcementID string) error {
	stmt, err := announcementTable.DB.Prepare(`
		DELETE FROM announcement WHERE announcement.id = ?
	`)
	if err != nil {
		log.Printf("Bad query: %s", err.Error())
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(announcementID)

	if err != nil {
		log.Printf("Unable to delete announcement: %s", err.Error())
		return err
	}

	return nil
}
