Memo architecture

### Data
Markdown as origin data source.
duckdb as secondary/derivative source.
.config file as configuration.

### Build time
Run source file through linter.
Double check data shape, including metadata like authors, tags, aliases, etc
Extract markdown metadata and save into duckdb as a runtime data source
Build markdown post into static html page, and use it to render body of the web.
Build markdown template and populate data from duckdb like menu, contributor, tags and search.

### Incremental build


### Runtime
Search
Search will use duckdb source on runtime.

### Aliases


### Contributors


### Web3: onchain profile


### Web3: mint an article
