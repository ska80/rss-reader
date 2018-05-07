
.PHONY: test check format

test:
	./node_modules/.bin/mocha --reporter list -c --ui exports test/*.test.js

check:
	@npm run -s check

format:
	@npm run -s format
