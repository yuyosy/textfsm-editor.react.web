# TextFSM Editor

A web-based editor for TextFSM templates with real-time parsing capabilities. This tool helps network engineers and developers create and test TextFSM templates efficiently with immediate feedback.

> ! This project is under development.

> ! This documentation is a work in progress. It may be incomplete or inaccurate.

![screenshot1](pictures/screenshot1.png)

## Features

### Editor Features

- 🎨 Interface Themes
  - Light and Dark mode support
- 📝 Advanced Editor Integration (Monaco Editor)
  - TextFSM syntax highlighting
  - Intelligent word suggestions and auto-completion
  - Code folding and minimap navigation
- 📄 Downloads Files
  - Supports downloading entered data and result data as files
- 📋 Clipboard Integration
  - Quick copy support

### Parsing Features

- ⚡ Real-time Template Parsing
  - Instant feedback on template changes
  - Error detection
- 🔍 Multiple Data View Options
  - Table view for structured data representation
  - JSON view for programmatic access

### Template Management

- 🗂️ Template Management
  - Save templates to LocalStorage
  - Load existing templates
- 🖇️ Import/Export Capabilities
  - Import templates from files
  - Export templates to files

Interface theme
![interface theme](pictures/features_theme.png)

Word suggestion and syntax highlighting
![Word suggestion and code highlight](pictures/features_editor.png)

Table display of parsed data
![Table display of parsed data](pictures/features_view_table.png)

JSON display of parsed data
![JSON display of parsed data](pictures/features_view_json.png)


## Project Structure


```
textfsm-editor.react.web/
├ Frontend/                                # React frontend application
│   ├ src/                                  # Source files
│   ├ package.json                          # Frontend project information and dependencies
│   └ ***                                   # Frontend other files
├ Backend/                                 # Python backend application
│   ├ src/                                  # Source files
│   ├ pyproject.toml                        # Backend project information and dependencies
│   └ ***                                   # Backend other files
├ textfsm-editor.react.web.code-workspace  # VSCode workspace file
├ README.md                                # This file
└ ***                                      # Workspace other files
```

Open the `textfsm-editor.react.web.code-workspace` file with VSCode to open the workspace.

## Getting Started

- Use the primitive environment
  - Use Node.js and Python without Docker.
  - Refer to the installation instructions for the primitive environment. [Getting Started with the Primitive Environment](#getting-started-with-the-primitive-environment)
- Use Docker Compose
  - Refer to the installation instructions for Docker Compose. [Getting Started with Docker Compose](#getting-started-with-docker-compose)


### Getting Started with the Primitive Environment

#### Prerequisites

- Node.js (v16 or higher)
- npm
- Python (v3.8 or higher)
- uv (recommended for Python environment)

#### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/textfsm-editor.react.web.git
cd textfsm-editor.react.web
```

2. Setup Frontend

```bash
# run command in the project root directory
cd frontend
npm install
```

3. Setup Backend

```bash
# run command in the project root directory
cd backend
uv sync
```

#### Development

The frontend and backend must be run separately. It is recommended to open them in separate terminals.

1. Run Frontend

```bash
# run command in the project root directory
cd frontend
npm run dev
```

Tips: If you want to change the port number at startup, use the --port option.

2. Run Backend

```bash
# run command in the project root directory
cd backend
uv run uvicorn src.main:app --reload
```

Tips: If you want to change the port number at startup, use the --port option.

3. Access the services
   - Frontend Service: `http://localhost:5173`
   - Backend Service: `http://localhost:8000`

#### Production

TODO

### Getting Started with Docker Compose

#### Prerequisites

- Docker
- Docker Compose

#### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/textfsm-editor.react.web.git
cd textfsm-editor.react.web
```

2. Build containers

```bash
docker compose build
```

#### Development

1. Start containers
```bash
docker compose --profile dev up
```

#### Production

TODO: 


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT License Copyright (c) 2023 yuyosy

## Notice

This project incorporates components from the project below.
monaco-editor is distributed in Copyright (c) 2016 - present Microsoft Corporation (MIT License).

- [monaco-editor](public/libs/monaco-editor) ([MIT License](public/libs/monaco-editor/LICENSE))

## References

- [GitHub - microsoft/monaco-editor](https://github.com/microsoft/monaco-editor)
- [React](https://react.dev)
- [Vite](https://vitejs.dev)
