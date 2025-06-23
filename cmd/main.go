package main

import (
	"fmt"
	"net/http"

	"github.com/UchaBokeria/goshad/examples"

	"github.com/a-h/templ"
)

func main() {
	mux := http.NewServeMux()
	mux.Handle("/ui", templ.Handler(examples.Index(examples.UI())))
	mux.Handle("/components", templ.Handler(examples.Index(examples.Components())))
	mux.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))
	fmt.Println("🚀 Server runing on http://localhost:5000")
	if err := http.ListenAndServe(":5050", mux); err != nil {
		fmt.Printf("Server error: %v\n", err)
	}
}
