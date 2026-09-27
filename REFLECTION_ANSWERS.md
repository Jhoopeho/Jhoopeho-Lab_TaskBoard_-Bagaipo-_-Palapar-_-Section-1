# Reflection Answers

## Q1: In Checkpoint B, why did create() fail on user_id and not on $fillable? What would happen if you added user_id to $fillable?

The `create()` failed on `user_id` because the migration defines `user_id` as a non-nullable foreign key (via `foreignId('user_id')->constrained()->cascadeOnDelete()`), so the database requires a value for this column. The `$fillable` check passes because `name` and `description` are in `$fillable`. If `user_id` were added to `$fillable`, mass assignment would allow users to set `user_id` directly via API requests, which is a security vulnerability—users could create projects owned by other users by spoofing the `user_id`.

## Q2: What is the difference between `$project->tasks` and `$project->tasks()`? Give one place you used each.

`$project->tasks` accesses the **relationship result** (a Collection of Task models) — it loads the related tasks if not already loaded, or returns the cached collection. `$project->tasks()` returns the **query builder** for the relationship, allowing you to chain query methods like `where()`, `orderBy()`, or `create()`. Used `$project->tasks` in `ProjectResource` when loading tasks with `whenLoaded('tasks')`, and used `$project->tasks()` in `TaskController@store` when calling `$project->tasks()->create($data)`.

## Q3: Why does the owner key appear in GET /api/projects/{id} but not in GET /api/projects?

In `ProjectResource`, `owner` is included via `whenLoaded('user')`, which only includes the key if the `user` relationship was explicitly eager-loaded. In `ProjectController@show`, the project is loaded with `->load(['user', 'tasks'])`, so `owner` appears. In `ProjectController@index`, projects are fetched with `->withCount('tasks')` but without loading the `user` relationship, so `whenLoaded('user')` returns null and `owner` is omitted from the collection response.

## Q4: Postman worked before you configured CORS, but React did not. Why?

Postman is a native desktop application that does not enforce the browser's Same-Origin Policy or CORS. Browsers block cross-origin requests from JavaScript (like React running on `localhost:5173` to `localhost:8000`) unless the server responds with appropriate CORS headers (`Access-Control-Allow-Origin`). Configuring `config/cors.php` with `allowed_origins => [env('FRONTEND_URL')]` makes the Laravel API send the required headers, allowing the browser to accept the response.

## Q5: After logout, the old token returns 401. What exactly did logout() delete, and where is it stored?

`logout()` calls `$request->user()->currentAccessToken()->delete()`, which deletes the **Personal Access Token** record from the `personal_access_tokens` database table that matches the token used in the current request. The token is stored in this table with its hashed value, name, and associated `tokenable_id` (the user). Deleting it invalidates that specific token immediately; subsequent requests using the same token fail authentication with 401.