import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import monkey, { cdn, util } from 'vite-plugin-monkey'

export default defineConfig({
    plugins: [
        vue(),
        monkey({
            entry: 'src/main.ts',
            userscript: {
                icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzNiAzNiI+CgogPGc+CiAgPGcgdHJhbnNmb3JtPSJyb3RhdGUoMTAuMzM4NSAxNy4zNTk3IDEyLjI5MzEpIiBzdHJva2U9Im51bGwiIGlkPSJsYXllcjEiICA+CiAgIDxwYXRoIHN0cm9rZT0ibnVsbCIgc3Ryb2tlLXdpZHRoPSIwLjAzMzA3IiBpZD0ic3ZnXzMwIiBwLWlkPSIyMzA5IiBmaWxsPSIjMjBiMGUzIiBkPSJtMTEuNzkzOTMsNC4wMjgxN2ExLjM1OTgzLDEuMzIxMjYgMCAwIDEgMS4xNTU4NiwwYTIuODI4NDcsMi43NDgyMyAwIDAgMSAwLjcwNzExLDAuNTAyMDhsMi43MTk2OCwyLjMxMjIybDEuOTQ0NTcsMGwyLjcxOTY3LC0yLjMxMjIyYTIuODU1NjUsMi43NzQ2NSAwIDAgMSAwLjcwNzExLC0wLjUwMjA4YTEuMzU5ODMsMS4zMjEyNiAwIDAgMSAxLjgwODYsMS4wOTY2NmExLjM1OTgzLDEuMzIxMjYgMCAwIDEgLTAuMjk5MTYsMC44ODUyNWE3LjYwMTUsNy4zODU4NyAwIDAgMSAtMC41OTgzMywwLjUyODVhMy45Mjk5MywzLjgxODQ1IDAgMCAxIC0wLjM4MDc1LDAuMzAzODlsMS42OTk3OSwwYTIuODgyODYsMi44MDEwOCAwIDAgMSAxLjk5ODk3LDAuODcyMDNhMi44OTY0NSwyLjgxNDI5IDAgMCAxIDAuOTExMDksMS45NDIyNWwwLDcuNTk3MjdhNS41MDczNiw1LjM1MTEzIDAgMCAxIC0wLjA2OCwxLjE0OTVhMy4wMTg4NSwyLjkzMzIxIDAgMCAxIC0xLjM1OTgzLDEuODQ5NzdhMi45MjM2NiwyLjg0MDcyIDAgMCAxIC0xLjU2MzgyLDAuNDIyODFsLTEyLjQ4MzMzLDBhNS43NjU3Miw1LjYwMjE3IDAgMCAxIC0xLjIyMzg1LC0wLjA2NjA4YTMuMDA1MjQsMi45MTk5OSAwIDAgMSAtMS44NzY1NywtMS4zMjEyNmEyLjkxMDA1LDIuODI3NSAwIDAgMSAtMC40NjIzNiwtMS41MTk0NmwwLC03LjUxNzk4YTYuMDkyMDgsNS45MTkyNiAwIDAgMSAwLC0xLjA5NjY2YTIuOTkxNjQsMi45MDY3OCAwIDAgMSAyLjcxOTY5LC0yLjM1MTg0bDEuNzgxNCwwYy0wLjI4NTU4LC0wLjE5ODE5IC0wLjUzMDM0LC0wLjQzNjAyIC0wLjc4ODcxLC0wLjY0NzQzYTEuMzU5ODMsMS4zMjEyNiAwIDAgMSAtMC40MzUxNSwtMS4wODM0M2ExLjM1OTgzLDEuMzIxMjYgMCAwIDEgMC42NjYzMywtMS4wNDM4bS0wLjMxMjc5LDUuMTI2NTFhMS4zNTk4MywxLjMyMTI2IDAgMCAwIC0xLjA3NDI4LDAuOTUxMzFhMS44MzU3OCwxLjc4MzcgMCAwIDAgMCwwLjUwMjA4bDAsNi4yNDk1OGExLjM1OTgzLDEuMzIxMjYgMCAwIDAgMC45MzgyOSwxLjMyMTI3YTEuNzk0OTgsMS43NDQwNyAwIDAgMCAwLjU4NDczLDAuMDkyNDhsMTEuMDU1NSwwYTEuMzU5ODMsMS4zMjEyNiAwIDAgMCAxLjI5MTgzLC0wLjc3OTU0YTEuOTAzNzgsMS44NDk3NyAwIDAgMCAwLjEzNTk5LC0wLjg3MjAzbDAsLTUuODEzNTZhMi4yODQ1MywyLjIxOTczIDAgMCAwIDAsLTAuNjM0MjFhMS4zNTk4MywxLjMyMTI2IDAgMCAwIC0wLjg4Mzg5LC0wLjg5ODQ3YTIuMTg5MzQsMi4xMjcyNCAwIDAgMCAtMC44NDMwOSwtMC4xMTg5MWwtMTAuNTY1OTUsMGE0LjU0MTg2LDQuNDEzMDIgMCAwIDAgLTAuNjM5MTIsMHptMCwwIi8+CiAgIDxwYXRoIHN0cm9rZT0ibnVsbCIgc3Ryb2tlLXdpZHRoPSIwLjUyNDE2IiBmaWxsPSIjMjBiMGUzIiAgZD0ibTEyLjgyMDE1LDEyLjEyMjUxYzAuMTg1NDYsMC4xODc0OSAwLjM4MDQ4LDAuMzcwNzMgMC41NTU5OCwwLjU2Njk1YzAuMzA0OTMsMC4zNDA5MyAwLjU3MTAzLDAuNTk0NDkgMC44NTA5NywwLjg5ODEyYy0wLjA2NTY2LC0wLjU1NDUxIDAuNjY2NCwtMC41OTQ5MSAwLjAzNzg5LC0wLjg3MjMzYy0wLjIwODMxLDAuMjA3MTMgLTAuNDgwOTgsMC40Mzg3NyAtMC42OTUyMSwwLjYwNzEzYy0wLjE5OTk3LDAuMTU3MTUgLTAuNDQwNTMsMC4zMzI4NiAtMC42MzA4NCwwLjQ3Mjc0Yy0wLjk3NDQzLDAuNzE2MjIgMC4xMTU0MiwyLjAxMjA3IDEuMDg4NzUsMS4yOTQ0NGwwLDBjMCwwIDEuMDIxMzIsLTAuNzYyMTQgMS40MzQwOSwtMS4xNDI1OWMwLjIyNDYsLTAuMjA3MDMgMC4zNDczMywtMC40NzQ0NCAwLjM2NzQxLC0wLjc5MDE2YzAuMDIwNjUsLTAuMzI0NzEgLTAuMjczMDEsLTAuNjE2MDIgLTAuNDA1NDMsLTAuNzQzNzdjLTAuNDcwMjgsLTAuNDUzNjYgLTAuODkwMjYsLTAuOTc3MDUgLTEuMzAzMTgsLTEuMzk1OTVjLTAuODA0NiwtMC44OTM0IC0yLjEwNTAzLDAuMjEyMTMgLTEuMzAwNDMsMS4xMDU1MmwwLjAwMDAxLC0wLjAwMDExeiIgaWQ9InN2Z18zMSIvPgogICA8cGF0aCBzdHJva2U9Im51bGwiIHN0cm9rZS13aWR0aD0iMC41MjQxNiIgZmlsbD0iIzIwYjBlMyIgIGQ9Im0yMi4wMjE4OSwxMi4xMjI1MWMtMC4xODU0NywwLjE4NzQ5IC0wLjM4MDQ4LDAuMzcwNzMgLTAuNTU1OTksMC41NjY5NWMtMC4zMDQ5MywwLjM0MDkzIC0wLjU3MTAzLDAuNTk0NDkgLTAuODUwOTcsMC44OTgxMmMwLjA2NTY2LC0wLjU1NDUxIC0wLjY2NjQsLTAuNTk0OTEgLTAuMDM3OTEsLTAuODcyMzNjMC4yMDgzMSwwLjIwNzEzIDAuNDgwOTgsMC40Mzg3NyAwLjY5NTIxLDAuNjA3MTNjMC4xOTk5NywwLjE1NzE1IDAuNDQwNTMsMC4zMzI4NiAwLjYzMDg1LDAuNDcyNzRjMC45NzQ0MiwwLjcxNjIyIC0wLjExNTQzLDIuMDEyMDcgLTEuMDg4NzUsMS4yOTQ0NGwwLDBjMCwwIC0xLjAyMTMyLC0wLjc2MjE0IC0xLjQzNDA4LC0xLjE0MjU5Yy0wLjIyNDYxLC0wLjIwNzAzIC0wLjM0NzM0LC0wLjQ3NDQ0IC0wLjM2NzQyLC0wLjc5MDE2Yy0wLjAyMDY0LC0wLjMyNDcxIDAuMjczMDEsLTAuNjE2MDIgMC40MDU0NCwtMC43NDM3N2MwLjQ3MDI4LC0wLjQ1MzY2IDAuODkwMjYsLTAuOTc3MDUgMS4zMDMxOCwtMS4zOTU5NWMwLjgwNDYsLTAuODkzNCAyLjEwNTAzLDAuMjEyMTMgMS4zMDA0MywxLjEwNTUybDAuMDAwMDIsLTAuMDAwMTF6IiBpZD0ic3ZnXzMyIi8+CiAgPC9nPgogIDxwYXRoIGlkPSJzdmdfMSIgZD0ibTI2LjYyMyw5Ljg1OWwwLjQ0LC01LjQzYzAuMDIyLC0wLjI3NCAwLjI2NSwtMC40OCAwLjUzOSwtMC40NThsMC4wMywwLjAwMmMwLjI3NCwwLjAyMiAwLjQ4LDAuMjY1IDAuNDU4LDAuNTM5bC0wLjQ0LDUuNDNjLTAuMDIyLDAuMjc0IC0wLjI2NSwwLjQ4IC0wLjUzOSwwLjQ1OGwtMC4wMywtMC4wMDJjLTAuMjc1LC0wLjAyMyAtMC40ODEsLTAuMjY1IC0wLjQ1OCwtMC41Mzl6IiBmaWxsPSIjNjY3NTdGIi8+CiAgPHBhdGggaWQ9InN2Z18yIiBkPSJtMTQuNDU3LDIwLjU0OGwwLDIuMDZzLTIuMDYsMCAtMi4wNiwyLjA2bDAsMy4wOWMwLDEuMDMgMS4wMywyLjA2IDIuMDYsMi4wNmwxMC4zMDIsMGMxLjAzLDAgMi4wNiwtMS4wMyAyLjA2LC0yLjA2bDAsLTUuMTUxYzAsLTEuMDMgLTEuMDMsLTIuMDYgLTIuMDYsLTIuMDZsLTEwLjMwMiwwLjAwMXoiIGZpbGw9IiMyOTJGMzMiLz4KICA8cGF0aCBpZD0ic3ZnXzMiIGQ9Im0yMS42MjIsMjIuMTU0bC0xMC4xNDUsLTEuNzg5Yy0xLjAxNCwtMC4xNzkgLTEuMDE0LC0wLjE3OSAtMC44MzYsLTEuMTkzYzAuMDk4LC0wLjU1OCAwLjYzNSwtMC45MzQgMS4xOTMsLTAuODM2bDEwLjE0NSwxLjc4OWMwLjU1OCwwLjA5OCAwLjkzNCwwLjYzNSAwLjgzNiwxLjE5M2MtMC4xNzgsMS4wMTUgLTAuMTc4LDEuMDE1IC0xLjE5MywwLjgzNnoiIGZpbGw9IiMyOTJGMzMiLz4KICA8cGF0aCBpZD0ic3ZnXzQiIGQ9Im0yMy45NzQsMTguNTExYy0wLjE5OSwwLjk0OSAtMC41NzQsMS44ODIgLTIuMTU3LDEuNTgzYy0xLjU4MywtMC4yOTggLTEuODM2LDEuMjYyIC0wLjg0OSwxLjUzOGMwLjk4NywwLjI3NSAzLjM1LDAuNjY2IDQuMDM5LC0wLjQ1OWMwLjY4OCwtMS4xMjQgMC44MDMsLTIuMjAzIDAuNzM0LC0yLjY4NWMtMC4wNjksLTAuNDgxIC0xLjYyLC0wLjY3OSAtMS43NjcsMC4wMjN6IiBmaWxsPSIjMjkyRjMzIi8+CiAgPHBhdGggaWQ9InN2Z181IiBkPSJtMjIuMTM3LDIyLjUwNGwtMTEuMTg5LC0xLjk3M2MtMC4yNzEsLTAuMDQ4IC0wLjQ1MywtMC4zMDggLTAuNDA2LC0wLjU3OWwwLjAwNSwtMC4wM2MwLjA0OCwtMC4yNzEgMC4zMDgsLTAuNDUzIDAuNTc5LC0wLjQwNmwxMS4xODksMS45NzNjMC4yNzEsMC4wNDggMC40NTMsMC4zMDggMC40MDYsMC41NzlsLTAuMDA1LDAuMDNjLTAuMDQ3LDAuMjcxIC0wLjMwOCwwLjQ1MyAtMC41NzksMC40MDZ6IiBmaWxsPSIjREQyRTQ0Ii8+CiAgPHBhdGggaWQ9InN2Z182IiBkPSJtMjcuNzc4LDguODQ4bC0xLjc4OSwxMC4xNDVjLTAuMTc5LDEuMDE0IC0wLjE3OSwxLjAxNCAtMS4xOTMsMC44MzZjLTAuNTU4LC0wLjA5OCAtMC45MzQsLTAuNjM1IC0wLjgzNiwtMS4xOTNsMS43ODksLTEwLjE0NmMwLjA5OCwtMC41NTggMC42MzUsLTAuOTM0IDEuMTkzLC0wLjgzNmMxLjAxNSwwLjE3OSAxLjAxNSwwLjE3OSAwLjgzNiwxLjE5NHptMS4wMjIsLTcuNzE2bC0wLjczNCw0LjE0NmMtMC4wOSwwLjUwOCAtMC4xNzMsMS4wMzggLTEuMTg4LDAuODU5Yy0wLjU1OCwtMC4wOTkgLTAuOTA4LC0wLjczNyAtMC43ODYsLTEuNDQxbDAuNjU4LC0zLjcxOGMwLjE2OCwtMC41OTcgMC42NDUsLTEuMDM0IDEuMjAzLC0wLjkzNmMxLjAxNCwwLjE4IDAuOTM3LDAuNTgyIDAuODQ3LDEuMDl6IiBmaWxsPSIjMjkyRjMzIi8+CiAgPHBhdGggaWQ9InN2Z183IiBkPSJtMjguMjcsOC40MDJsLTEuOTczLDExLjE4OWMtMC4wNDgsMC4yNzEgLTAuMzA4LDAuNDUzIC0wLjU3OSwwLjQwNmwtMC4wMywtMC4wMDVjLTAuMjcxLC0wLjA0OCAtMC40NTMsLTAuMzA4IC0wLjQwNiwtMC41NzlsMS45NzMsLTExLjE4OWMwLjA0OCwtMC4yNzEgMC4zMDgsLTAuNDUzIDAuNTc5LC0wLjQwNmwwLjAzLDAuMDA1YzAuMjcxLDAuMDQ4IDAuNDUzLDAuMzA4IDAuNDA2LDAuNTc5em0xLjI4LC03LjY4bC0wLjk0Myw1LjM2NmMtMC4wNDgsMC4yNzEgLTAuMzA4LDAuNDU0IC0wLjU3OSwwLjQwNmwtMC4wMywtMC4wMDVjLTAuMjcxLC0wLjA0OCAtMC40NTMsLTAuMzA4IC0wLjQwNiwtMC41NzlsMC45NDMsLTUuMzY2YzAuMDQ4LC0wLjI3MSAwLjMwOCwtMC40NTMgMC41NzksLTAuNDA2bDAuMDMsMC4wMDVjMC4yNzEsMC4wNDggMC40NTMsMC4zMDggMC40MDYsMC41Nzl6IiBmaWxsPSIjREQyRTQ0Ii8+CiAgPHBhdGggaWQ9InN2Z184IiBkPSJtMjQuMjM3LDE3LjkxMmwtNy42OTEsLTEuMzU2Yy0wLjc2OSwtMC4xMzYgLTAuNzY5LC0wLjEzNiAtMC42MzUsLTAuODk1YzAuMDc0LC0wLjQxOCAwLjQ4LC0wLjY5OCAwLjkwMywtMC42MjRsNy42OTEsMS4zNTZjMC40MjMsMC4wNzUgMC43MDksMC40NzcgMC42MzUsMC44OTVjLTAuMTM0LDAuNzU5IC0wLjEzNCwwLjc1OSAtMC45MDMsMC42MjR6IiBmaWxsPSIjMjkyRjMzIi8+CiAgPHBhdGggaWQ9InN2Z185IiBkPSJtMjEuNzk0LDIxLjM5N2MxLjAyMywwLjE4IDMuMDQzLDAuNTM3IDMuNTgsLTIuNTA3YzAuNTM3LC0zLjA0MyAxLjU1MSwtMi44NjUgMS4wMTQsMC4xNzlzLTIuMzA0LDMuNzc4IC00Ljc3MywzLjM0MmMtMi4wMjksLTAuMzU3IC0xLjg1LC0xLjM3MiAwLjE3OSwtMS4wMTR6bS0xMC42NDEsLTEuODc2YzIuMDMsMC4zNSAyLjM0NSwxLjQ2NSAwLjMxNywxLjEwMmMtMC44OTksLTAuMTYxIC0xLjAxNCwwLjIxOCAtMS4yODksMC45ODdjLTAuMjU5LDAuNzIzIC0wLjYzLDEuODEgLTEuMTc4LDMuMzI4Yy0wLjQwMywxLjExNSAtMS4zMTcsMC42MjEgLTAuOTc5LC0wLjM1MmMwLjU2OCwtMS42MzYgMS4wOTMsLTMuMDU4IDEuNDM0LC0zLjk2MmMwLjM0OCwtMC45MjQgMC42MzIsLTEuMjg2IDEuNjk1LC0xLjEwM3oiIGZpbGw9IiNERDJFNDQiLz4KICA8cGF0aCBpZD0ic3ZnXzEwIiBkPSJtOC45MjksMjMuNjU0bC0wLjAyOSwtMC4wMTFjLTAuMjU4LC0wLjA5NCAtMC41NDcsMC4wNCAtMC42NDEsMC4yOTlsLTIuMTI0LDUuODM2Yy0wLjA5NCwwLjI1OCAwLjA0LDAuNTQ3IDAuMjk5LDAuNjQxbDAuMDI4LDAuMDFjMC4yNTgsMC4wOTQgMC41NDcsLTAuMDQgMC42NDEsLTAuMjk5bDIuMTI0LC01LjgzNmMwLjA5NCwtMC4yNTggLTAuMDQsLTAuNTQ2IC0wLjI5OCwtMC42NHoiIGZpbGw9IiNERDJFNDQiLz4KICA8cGF0aCBpZD0ic3ZnXzExIiBkPSJtNi40NjIsMzAuNDNsLTMuOSwtMS40MmMtMC4yNTgsLTAuMDk0IC0wLjM5MywtMC4zODIgLTAuMjk5LC0wLjY0MWwwLjAxLC0wLjAyOGMwLjA5NCwtMC4yNTggMC4zODIsLTAuMzkzIDAuNjQxLC0wLjI5OWwzLjksMS40MmMwLjI1OCwwLjA5NCAwLjM5MywwLjM4MiAwLjI5OSwwLjY0MWwtMC4wMSwwLjAyOGMtMC4wOTQsMC4yNTggLTAuMzgyLDAuMzkzIC0wLjY0MSwwLjI5OXoiIGZpbGw9IiM2Njc1N0YiLz4KICA8cGF0aCBpZD0ic3ZnXzEyIiBkPSJtMTIuMjI1LDMwLjcxOGwzLjA2LC0zLjA2YzAuMTk0LC0wLjE5NCAwLjE5NCwtMC41MTMgMCwtMC43MDdsLTAuMDIxLC0wLjAyMWMtMC4xOTQsLTAuMTk0IC0wLjUxMywtMC4xOTQgLTAuNzA3LDBsLTMuMDYsMy4wNmMtMC4xOTQsMC4xOTQgLTAuMTk0LDAuNTEzIDAsMC43MDdsMC4wMjEsMC4wMjFjMC4xOTQsMC4xOTQgMC41MTIsMC4xOTQgMC43MDcsMHptMTguNzQ0LDMuMjIybC0wLjA2LDBjLTAuNTUsMCAtMSwtMC40NSAtMSwtMWwwLC0zLjE1MWMwLC0wLjU1IDAuNDUsLTEgMSwtMWwwLjA2LDBjMC41NSwwIDEsMC40NSAxLDFsMCwzLjE1MWMwLDAuNTUgLTAuNDUsMSAtMSwxeiIgZmlsbD0iI0REMkU0NCIvPgogIDxwYXRoIGlkPSJzdmdfMTMiIGQ9Im0xMS45MTEsMzMuOTRsLTAuMDYsMGMtMC41NSwwIC0xLC0wLjQ1IC0xLC0xbDAsLTMuMTUxYzAsLTAuNTUgMC40NSwtMSAxLC0xbDAuMDYsMGMwLjU1LDAgMSwwLjQ1IDEsMWwwLDMuMTUxYzAsMC41NSAtMC40NSwxIC0xLDF6bTEzLjMyOSwtNi4xODZsMi4wOSwwYzAuMjc1LDAgMC41LC0wLjIyNSAwLjUsLTAuNWwwLC0wLjAzYzAsLTAuMjc1IC0wLjIyNSwtMC41IC0wLjUsLTAuNWwtMi4wOSwwYy0wLjI3NSwwIC0wLjUsMC4yMjUgLTAuNSwwLjVsMCwwLjAzYzAsMC4yNzUgMC4yMjUsMC41IDAuNSwwLjV6IiBmaWxsPSIjREQyRTQ0Ii8+CiAgPHBhdGggaWQ9InN2Z18xNCIgZD0ibTMwLjA0NywzMC42NTdsLTMuMDYsLTMuMDZjLTAuMTk0LC0wLjE5NCAtMC4xOTQsLTAuNTEzIDAsLTAuNzA3bDAuMDIxLC0wLjAyMWMwLjE5NCwtMC4xOTQgMC41MTMsLTAuMTk0IDAuNzA3LDBsMy4wNiwzLjA2YzAuMTk0LDAuMTk0IDAuMTk0LDAuNTEzIDAsMC43MDdsLTAuMDIxLDAuMDIxYy0wLjE5NSwwLjE5NSAtMC41MTMsMC4xOTUgLTAuNzA3LDB6IiBmaWxsPSIjREQyRTQ0Ii8+CiAgPHBhdGggaWQ9InN2Z18xNSIgZD0ibTkuOTk4LDE1LjUyOGMwLjc2NSwwLjMyOCAyLjExMSwwLjk2NCAyLjQxLDEuMDc5YzAsMCAwLjEzOCwtMC45MTggMC41MDUsLTAuOTE4YzAsMCAwLjEzOCwtMC40ODIgMC4yMjksLTAuNjg4YzAuMDkyLC0wLjIwNyAwLjM2NywtMC4xMzggMC4zOSwwLjI1MmMwLjAyMywwLjM5IC0wLjA5MiwwLjUyOCAtMC4wOTIsMC41MjhzMC4zNDQsMC40MzYgMC4xMzgsMS4wMzNjMCwwIDAuNDU5LDAuMDY5IDAuMzY3LDAuNjQzYy0wLjA5MiwwLjU3NCAwLjA2OSwxLjAxIC0wLjM0NCwxLjEyNGMtMC40MTMsMC4xMTUgLTEuOTc0LDAuNTUxIC0xLjk5NywtMC4wNjljLTAuMDIzLC0wLjYyIC0wLjQxMywtMS4xMDIgLTEuMTcsLTEuNTYxYy0wLjc1NywtMC40NTkgLTEuMzA4LC0wLjk2NCAtMS4yMTYsLTEuMjE2YzAuMDkxLC0wLjI1MyAwLjEzNywtMC40ODIgMC43OCwtMC4yMDd6IiBmaWxsPSIjMjkyRjMzIi8+CiAgPHBhdGggaWQ9InN2Z18xNiIgZD0ibTI1LjI4OCwyNC42NjhsLTExLjM2MSwwYy0wLjI3NSwwIC0wLjUsLTAuMjI1IC0wLjUsLTAuNWwwLC0wLjAzYzAsLTAuMjc1IDAuMjI1LC0wLjUgMC41LC0wLjVsMTEuMzYyLDBjMC4yNzUsMCAwLjUsMC4yMjUgMC41LDAuNWwwLDAuMDNjLTAuMDAxLDAuMjc1IC0wLjIyNiwwLjUgLTAuNTAxLDAuNXoiIGZpbGw9IiNERDJFNDQiLz4KICA8Y2lyY2xlIGlkPSJzdmdfMTciIHI9IjQuNjM2IiBjeT0iMzEuMzY0IiBjeD0iMjAuMTIyIiBmaWxsPSIjNjY3NTdGIi8+CiAgPGNpcmNsZSBpZD0ic3ZnXzE4IiByPSIyLjU3NSIgY3k9IjMzLjQyNSIgY3g9IjExLjg4MSIgZmlsbD0iIzY2NzU3RiIvPgogIDxjaXJjbGUgaWQ9InN2Z18xOSIgcj0iMi4wNiIgY3k9IjMzLjk0IiBjeD0iMzAuOTM5IiBmaWxsPSIjNjY3NTdGIi8+CiAgPGNpcmNsZSBpZD0ic3ZnXzIwIiByPSIyLjU3NSIgY3k9IjMxLjM2NCIgY3g9IjIwLjEyMiIgZmlsbD0iI0NDRDZERCIvPgogIDxjaXJjbGUgaWQ9InN2Z18yMSIgcj0iMS41NDUiIGN5PSIzMy40MjUiIGN4PSIxMS44ODEiIGZpbGw9IiNDQ0Q2REQiLz4KICA8Y2lyY2xlIGlkPSJzdmdfMjIiIHI9IjEuMDMiIGN5PSIzMy45NCIgY3g9IjMwLjkzOSIgZmlsbD0iIzI5MkYzMyIvPgogIDxnIGlkPSJzdmdfMjMiIGZpbGw9IiMyOTJGMzMiPgogICA8Y2lyY2xlIGlkPSJzdmdfMjQiIHI9IjAuNTE1IiBjeT0iMzAuNDcyIiBjeD0iMjAuNjM4Ii8+CiAgIDxjaXJjbGUgaWQ9InN2Z18yNSIgcj0iMC41MTUiIGN5PSIzMi4yNTYiIGN4PSIxOS42MDciLz4KICAgPGNpcmNsZSBpZD0ic3ZnXzI2IiByPSIwLjUxNSIgY3k9IjMwLjg0OSIgY3g9IjE5LjIzIi8+CiAgIDxjaXJjbGUgaWQ9InN2Z18yNyIgcj0iMC41MTUiIGN5PSIzMS44NzkiIGN4PSIyMS4wMTUiLz4KICA8L2c+CiAgPGNpcmNsZSBpZD0ic3ZnXzI4IiByPSIwLjc3MyIgY3k9IjMzLjQyNSIgY3g9IjExLjg4MSIgZmlsbD0iIzI5MkYzMyIvPgogIDxjaXJjbGUgaWQ9InN2Z18yOSIgcj0iMC41MTUiIGN5PSIzMy45NCIgY3g9IjMwLjkzOSIgZmlsbD0iIzY2NzU3RiIvPgogPC9nPgo8L3N2Zz4=',
                name: { '': 'Bilibili-Live-Spamer', zh: 'Bilibili-Live-Spamer' },
                description: { '': 'B站直播文字、表情独轮车', zh: 'B站直播文字、表情独轮车' },
                namespace: 'https://github.com/ADJazzzz',
                homepageURL: 'https://github.com/ADJazzzz/BLSPAM',
                supportURL: 'https://github.com/ADJazzzz/BLSPAM/issues',
                license: 'MIT',
                author: 'ADJazz',
                copyright: '2023, ADJazz (https://github.com/ADJazzzz)',
                downloadURL:
                    'https://github.com/ADJazzzz/BLSPAM/releases/latest/download/bilibili-live-spamer.min.user.js',
                updateURL:
                    'https://github.com/ADJazzzz/BLSPAM/releases/latest/download/bilibili-live-spamer.min.user.js',
                match: ['*://live.bilibili.com/*'],
                'run-at': 'document-end',
                connect: ['api.bilibili.com', 'api.live.bilibili.com', 'live.bilibili.com']
            },
            build: {
                externalGlobals: {
                    vue: cdn.unpkg('Vue', 'dist/vue.global.prod.js').concat(
                        await util.fn2dataUrl(() => {
                            // @ts-ignore
                            window.Vue = Vue
                            // @ts-ignore
                            window.VueDemi = Vue
                        })
                    ),
                    pinia: cdn.unpkg('Pinia', 'dist/pinia.iife.prod.js'),
                    'naive-ui': cdn.unpkg('naive', 'dist/index.prod.js'),
                    axios: cdn.unpkg('axios', 'dist/axios.min.js'),
                    lodash: cdn.unpkg('_', 'lodash.min.js')
                }
            }
        })
    ]
})
