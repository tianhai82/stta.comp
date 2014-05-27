package stta

import (
	"appengine"
	"appengine/datastore"
	"appengine/user"
	"encoding/json"
	"github.com/gorilla/mux"
	"html/template"
	"net/http"
	"strconv"
)

func checkLoginUser(w http.ResponseWriter, r *http.Request, c appengine.Context) bool {
	u := user.Current(c)
	if u == nil {
		url, err := user.LoginURL(c, r.URL.String())
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return false
		}
		w.Header().Set("Location", url)
		w.WriteHeader(http.StatusFound)
		return false
	}
	return true
}
func competitionPageHandler(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	if !checkLoginUser(w, r, c) {
		return
	}
	params := mux.Vars(r)
	id := params["id"]
	if id == "" {
		http.Error(w, "competition "+id+" not found", http.StatusInternalServerError)
		return
	} else {
		compId, err := strconv.Atoi(id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		k := datastore.NewKey(c, "competition", "", int64(compId), nil)
		comp := new(Competition)
		if err := datastore.Get(c, k, comp); err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		u := user.Current(c)

		validUser := false
		if u.Admin {
			validUser = true
		} else {
			for _, b := range comp.Admins {
				if b.Email == u.Email {
					validUser = true
				}
			}
		}
		if !validUser {
			http.Error(w, "Invalid User. Please ask STTA Administrator to give you rights", 500)
			return
		}
		comp.Admins = comp.Admins[:0]
		compByte, err := json.Marshal(comp)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		compStr := string(compByte)
		var compTmpl = template.Must(template.ParseFiles("html/competition/competition.html"))

		compTmpl = compTmpl.Delims("[{[", "]}]")

		tc := make(map[string]interface{})
		tc["Competition"] = compStr
		tc["Title"] = comp.Name
		err = compTmpl.Execute(w, tc)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}
