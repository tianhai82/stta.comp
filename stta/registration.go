package stta

import (
	"appengine"
	"appengine/datastore"
	"encoding/json"
	"github.com/gorilla/mux"
	"net/http"
	"strconv"
)

func registrationPostRestHandler(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	if !checkLoginUser(w, r, c) {
		return
	}
	params := mux.Vars(r)
	compId := params["compId"]
	_, err := retrieveCompetition(compId, c)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	decoder := json.NewDecoder(r.Body)
	var registration Registration
	err = decoder.Decode(&registration)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	} else {
		registration.CompetitionId, err = strconv.Atoi(compId)
		if err != nil {
			http.Error(w, "Invalid competition id", http.StatusInternalServerError)
			return
		}

		compKey := datastore.NewKey(
			c,             // appengine.Context.
			"competition", // Kind.
			"",            // String ID; empty means no string ID.
			int64(registration.CompetitionId), // Integer ID; if 0, generate automatically. Ignored if string ID specified.
			nil, // Parent Key; nil means no parent.
		)

		_, high, err := datastore.AllocateIDs(c, "registration", compKey, 1)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		registration.Id = int(high)
		regKey := datastore.NewKey(
			c,
			"registration",
			"",
			high,
			compKey,
		)
		_, err = datastore.Put(c, regKey, &registration)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

func registrationGetRestHandler(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	if !checkLoginUser(w, r, c) {
		return
	}
	params := mux.Vars(r)
	compId := params["compId"]
	regId := params["id"]
	if compId == "" {
		http.Error(w, "no competition id specified", http.StatusInternalServerError)
		return
	}
	if regId != "" {
		comp, err := retrieveCompetition(compId, c)
		if err != nil {
			http.Error(w, "competition: "+compId+" not found", http.StatusInternalServerError)
			return
		}
		rId, _ := strconv.Atoi(regId)
		if err != nil {
			http.Error(w, "Invalid registration id", http.StatusInternalServerError)
			return
		}

		compKey := datastore.NewKey(
			c,              // appengine.Context.
			"competition",  // Kind.
			"",             // String ID; empty means no string ID.
			int64(comp.Id), // Integer ID; if 0, generate automatically. Ignored if string ID specified.
			nil,            // Parent Key; nil means no parent.
		)
		regKey := datastore.NewKey(c, "registration", "", int64(rId), compKey)
		var registration Registration
		err = datastore.Get(c, regKey, &registration)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		enc := json.NewEncoder(w)
		if err := enc.Encode(registration); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	} else {
		comp, err := retrieveCompetition(compId, c)
		if err != nil {
			http.Error(w, "competition: "+compId+" not found", http.StatusInternalServerError)
			return
		}

		compKey := datastore.NewKey(
			c,              // appengine.Context.
			"competition",  // Kind.
			"",             // String ID; empty means no string ID.
			int64(comp.Id), // Integer ID; if 0, generate automatically. Ignored if string ID specified.
			nil,            // Parent Key; nil means no parent.
		)

		q := datastore.NewQuery("registration").Ancestor(compKey).Order("-PlayerParticipating.Dob")
		var registrations []Registration
		if _, err := q.GetAll(c, &registrations); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if registrations == nil || len(registrations) == 0 {
			return
		}
		w.Header().Set("Content-Type", "application/json")
		enc := json.NewEncoder(w)
		if err := enc.Encode(registrations); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}
