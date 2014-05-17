package stta

import (
	"appengine"
	"appengine/user"
	"fmt"
	"github.com/gorilla/mux"
	"net/http"
)

type Test struct {
	A, B, C string
}

func init() {
	r := mux.NewRouter()
	// Mandatory root-based resources
	serveSingle("/sitemap.xml", "./sitemap.xml", r)
	serveSingle("/favicon.ico", "./favicon.ico", r)
	serveSingle("/robots.txt", "./robots.txt", r)
	r.HandleFunc("/", handler)
	http.Handle("/", r)
}

func handler(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	u := user.Current(c)
	if u == nil {
		url, err := user.LoginURL(c, r.URL.String())
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Location", url)
		w.WriteHeader(http.StatusFound)
		return
	}
	fmt.Fprintf(w, "Hello, %v!", u)
}

func serveSingle(pattern string, filename string, r *mux.Router) {
	r.HandleFunc(pattern, func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, filename)
	})
}
