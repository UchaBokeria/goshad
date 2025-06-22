package main

import (
	"fmt"
	"net/http"

	"github.com/UchaBokeria/goshad/examples"

	"github.com/a-h/templ"
)

func main() {
	mux := http.NewServeMux()
	mux.Handle("/", templ.Handler(examples.Index()))
	mux.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))
	fmt.Println("🚀 Server starting on http://localhost:5000")
	if err := http.ListenAndServe(":5000", mux); err != nil {
		fmt.Printf("Server error: %v\n", err)
	}
}
