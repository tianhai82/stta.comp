package stta

import (
	"appengine"
	"appengine/datastore"
	"appengine/user"
	"encoding/json"
	"github.com/gorilla/mux"
	"net/http"
	"strconv"
)

func init() {
	r := mux.NewRouter()
	r.HandleFunc("/api/competition", competitionGetRestHandler).Methods("GET")
	r.HandleFunc("/api/competition/{id:[0-9]+}", competitionGetRestHandler).Methods("GET")
	r.HandleFunc("/api/competition/{id:[0-9]+}", competitionPutRestHandler).Methods("PUT", "DELETE")
	r.HandleFunc("/api/competition", competitionPostRestHandler).Methods("POST")

	r.HandleFunc("/api/competition/{compId:[0-9]+}/registration", registrationGetRestHandler).Methods("GET")
	r.HandleFunc("/api/competition/{compId:[0-9]+}/registration/{id:[0-9]+}", registrationGetRestHandler).Methods("GET")
	// r.HandleFunc("/api/competition/{compId:[0-9]+}/registration/{id:[0-9]+}", registrationPutRestHandler).Methods("PUT", "DELETE")
	r.HandleFunc("/api/competition/{compId:[0-9]+}/registration", registrationPostRestHandler).Methods("POST")

	r.HandleFunc("/competition/{id:[0-9]+}", competitionPageHandler).Methods("GET")
	http.Handle("/", r)
}

func checkUser(w http.ResponseWriter, r *http.Request, c appengine.Context) bool {
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
	if !user.IsAdmin(c) {

		http.Error(w, "Unauthorised", http.StatusUnauthorized)
		return false
	}
	return true
}
func competitionGetRestHandler(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	if !checkUser(w, r, c) {
		return
	}
	params := mux.Vars(r)
	id := params["id"]
	if id == "" {
		q := datastore.NewQuery("competition").Order("-RegistrationDeadline")
		var competitions []Competition
		if _, err := q.GetAll(c, &competitions); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if competitions == nil || len(competitions) == 0 {
			return
		}
		w.Header().Set("Content-Type", "application/json")
		enc := json.NewEncoder(w)
		if err := enc.Encode(competitions); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

	} else {
		comp, err := retrieveCompetition(id, c)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		enc := json.NewEncoder(w)
		if err := enc.Encode(comp); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

func retrieveCompetition(id string, c appengine.Context) (*Competition, error) {
	compId, err := strconv.Atoi(id)
	if err != nil {
		return nil, err
	}

	k := datastore.NewKey(c, "competition", "", int64(compId), nil)
	comp := new(Competition)
	if err := datastore.Get(c, k, comp); err != nil {
		return nil, err
	}
	return comp, nil
}

func competitionPostRestHandler(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	if !checkUser(w, r, c) {
		return
	}
	decoder := json.NewDecoder(r.Body)
	var competition Competition
	err := decoder.Decode(&competition)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	} else {
		_, high, err := datastore.AllocateIDs(c, "competition", nil, 1)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		competition.Id = int(high)
		key := datastore.NewKey(
			c,             // appengine.Context.
			"competition", // Kind.
			"",            // String ID; empty means no string ID.
			high,          // Integer ID; if 0, generate automatically. Ignored if string ID specified.
			nil,           // Parent Key; nil means no parent.
		)
		_, err = datastore.Put(c, key, &competition)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

func competitionPutRestHandler(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	if !checkUser(w, r, c) {
		return
	}
	if r.Method == "DELETE" {
		params := mux.Vars(r)
		id, err := strconv.Atoi(params["id"])
		if err != nil {
			http.Error(w, "Unauthorised", http.StatusUnauthorized)
			return
		}
		key := datastore.NewKey(
			c,             // appengine.Context.
			"competition", // Kind.
			"",            // String ID; empty means no string ID.
			int64(id),     // Integer ID; if 0, generate automatically. Ignored if string ID specified.
			nil,           // Parent Key; nil means no parent.
		)
		err = datastore.Delete(c, key)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	} else if r.Method == "PUT" {
		decoder := json.NewDecoder(r.Body)
		var competition Competition
		err := decoder.Decode(&competition)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		} else {
			key := datastore.NewKey(
				c,             // appengine.Context.
				"competition", // Kind.
				"",            // String ID; empty means no string ID.
				int64(competition.Id), // Integer ID; if 0, generate automatically. Ignored if string ID specified.
				nil, // Parent Key; nil means no parent.
			)
			_, err = datastore.Put(c, key, &competition)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}
	}
}
