package controllers

import (
	"coterie/models"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi"
	"github.com/qkgo/yin"
)

//NESTED

//GetChapters returns all the chapters for a scripture
func GetChapters(chapterTable *models.ChapterTable) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		res, _ := yin.Event(w, r)
		
		scriptureID := chi.URLParam(r, "scriptureID")

		chapters, err := chapterTable.ChaptersLister(scriptureID)
		if err != nil {
			http.Error(w, http.StatusText(404), 404)
			return
		}

		res.SendJSON(chapters)
	}
}

//AddChapter adds an instance of chapter to a scrip
func AddChapter(chapterTable *models.ChapterTable) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		res, req := yin.Event(w, r)
		
		scriptureID := chi.URLParam(r, "scriptureID")
		body := map[string]string{}
		req.BindBody(&body)

		scripID, _ := strconv.Atoi(scriptureID)
		pos, _ := strconv.Atoi(body["position"])
		chapter := models.Chapter{
			Name:        body["name"],
			Text:        body["text"],
			Position:    pos,
			ScriptureID: scripID,
			CreatedAt:   time.Now().String(),
			UpdatedAt:   time.Now().String(),
		}

		result, err := chapterTable.ChapterAdder(chapter)
		if err != nil {
			http.Error(w, http.StatusText(404), 404)
			return
		}

		res.SendJSON(result)
	}
}

//UNNESTED

//GetChapter retrieves single instance of chapter
func GetChapter(chapterTable *models.ChapterTable) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		res, _ := yin.Event(w, r)
		
		chapterID := chi.URLParam(r, "chapterID")

		chapter, err := chapterTable.ChapterGetter(chapterID)
		if err != nil {
			http.Error(w, http.StatusText(404), 404)
			return
		}

		res.SendJSON(chapter)
	}
}

//UpdateChapter will update an instance of chapter in DB
func UpdateChapter(chapterTable *models.ChapterTable) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		res, req := yin.Event(w, r)
		
		chapterID := chi.URLParam(r, "chapterID")
		body := map[string]string{}
		req.BindBody(&body)

		chapID, _ := strconv.Atoi(chapterID)
		pos, _ := strconv.Atoi(body["position"])
		chapter := models.Chapter{
			ID:        chapID,
			Name:      body["name"],
			Text:      body["text"],
			Position:  pos,
			UpdatedAt: time.Now().String(),
		}

		result, err := chapterTable.ChapterUpdater(chapter)
		if err != nil {
			http.Error(w, http.StatusText(404), 404)
			return
		}

		res.SendJSON(result)
	}
}

//DeleteChapter removes a chapter from the DB
func DeleteChapter(chapterTable *models.ChapterTable) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		res, _ := yin.Event(w, r)
		
		chapterID := chi.URLParam(r, "chapterID")

		err := chapterTable.ChapterDeleter(chapterID)
		if err != nil {
			http.Error(w, http.StatusText(400), 400)
			return
		}

		res.SendStatus(200)
	}
}
