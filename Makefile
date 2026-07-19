.PHONY: quality

quality: node_modules/.package-lock.json
	npm run quality

node_modules/.package-lock.json: package.json package-lock.json
	npm ci --prefer-offline --no-audit --fund=false
