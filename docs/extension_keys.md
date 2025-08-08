# Extension Keys

Due to the difficulty of setting up proper API-to-extension communication (

- SameSite=Lax on Supabase Auth Cookies
- Origin mismatch
- Friction and fragmentation if adding authentication separately in the ext
- PKCE flow not applicable in this case
  ) setting up a proper key system to let extensions do AI queries is required.

This system is fairly easy, it consists of a table containing 5 entries:

| id   | created_at | key  | user_id | usage   |
| ---- | ---------- | ---- | ------- | ------- |
| uuid | timestamp  | uuid | uuid    | numeric |

Those entries all have a specific role:

- `id` to identify the row and manage it
- `created_at` is obvious
- `key` rotating key used by the extension, routes using extension keys will
  return the next `key` after each use
- `user_id` the user linked with the key
- `usage` the usage of the key

To avoid any issues with overcoming plan keys limitations, key creation is only
allowed to the authenticated user when executed with an instance with service
role.
