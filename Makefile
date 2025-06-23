.PHONY: run

run:
	templ generate \
	--watch \
	--open-browser=false \
	--proxyport="5000" \
	--proxybind="localhost" \
	--proxy="http://localhost:5050" \
	--cmd="go run cmd/main.go"
