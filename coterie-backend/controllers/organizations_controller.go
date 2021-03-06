package controllers

import (
	"coterie/models"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi"
	"github.com/qkgo/yin"
)

// GetOrganization retrieves all orgs for a user
func GetOrganizations(organizationTable *models.OrganizationTable, userTable *models.UserTable) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		res, _ := yin.Event(w, r)

		userID := chi.URLParam(r, "userID")

		organizations, err := organizationTable.OrganizationsLister(userID)
		if err != nil {
			http.Error(w, http.StatusText(404), 404)
			return
		}

		res.SendJSON(organizations)
	}
}

//AddOrganization is create action to a given user
func AddOrganization(organizationTable *models.OrganizationTable, userTable *models.UserTable) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		res, req := yin.Event(w, r)

		body := map[string]string{}
		req.BindBody(&body)

		userIDStr := chi.URLParam(r, "userID")

		userID, err := strconv.Atoi(userIDStr)
		tFunds, _ := strconv.Atoi(body["total_funds"])
		organization := models.Organization{
			Name:             body["name"],
			MissionStatement: body["mission_statement"],
			TotalFunds:       tFunds,
			UserID:           userID,
			CreatedAt:        time.Now().String(),
			UpdatedAt:        time.Now().String(),
		}

		result, err := organizationTable.OrganizationAdder(organization)
		if err != nil {
			http.Error(w, http.StatusText(404), 404)
			return
		}

		res.SendJSON(result)

		url := goDotEnvVariable("CLIENT_BASE_URL_PROD") + "/dashboard"
		http.Redirect(w, r, url, http.StatusSeeOther)
		return
	}
}

// GetOrganization is show action
func GetOrganization(organizationTable *models.OrganizationTable) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		res, _ := yin.Event(w, r)

		organizationID := chi.URLParam(r, "organizationID")

		organization, err := organizationTable.OrganizationGetter(organizationID)
		if err != nil {
			http.Error(w, http.StatusText(404), 404)
			return
		}

		res.SendJSON(organization)
	}
}

//UpdateOrganization is update action
func UpdateOrganization(organizationTable *models.OrganizationTable) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		_, req := yin.Event(w, r)
		organizationID := chi.URLParam(r, "organizationID")
		body := map[string]string{}
		req.BindBody(&body)

		orgID, _ := strconv.Atoi(organizationID)
		organization := models.Organization{
			ID:               orgID,
			Name:             body["name"],
			MissionStatement: body["mission_statement"],
			UpdatedAt:        time.Now().String(),
		}

		_, err := organizationTable.OrganizationUpdater(organization)
		if err != nil {
			http.Error(w, http.StatusText(404), 404)
			return
		}

		// res.SendJSON(result)
		url := goDotEnvVariable("CLIENT_BASE_URL_PROD") + "/dashboard"
		http.Redirect(w, r, url, http.StatusSeeOther)
		return
	}
}

//DeleteOrganization is destroy action
func DeleteOrganization(organizationTable *models.OrganizationTable) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// _, _ := yin.Event(w, r)

		organizationID := chi.URLParam(r, "organizationID")

		err := organizationTable.OrganizationDeleter(organizationID)
		if err != nil {
			http.Error(w, http.StatusText(400), 400)
			return
		}

		// res.SendStatus(200)
		url := goDotEnvVariable("CLIENT_BASE_URL_PROD") + "/dashboard"
		http.Redirect(w, r, url, http.StatusSeeOther)
		return
	}
}
