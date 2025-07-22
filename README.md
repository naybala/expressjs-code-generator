# 153808 ExpressJS Code Generator

A simple CLI tool to quickly generate ExpressJS core features including domain repositories, controllers, services, routes, validations, and resources based on your input.

---

## Features

- Generate domain repository and interface files
- Generate RESTful controller with common CRUD methods
- Create service layer with pagination support
- Scaffold routes with authentication and validation middleware
- Create validation rules using `express-validator`
- Supports generating for different modules like `Web`, `Mobile`, `Spa`

---

## Installation

Install via npm:

```bash
npm install mini-express-generator

"scripts": {
    ...,
    ... other scripts,
    ...,
    "make-core-feature": "node ./node_modules/mini-express-generator/index.js"
  }
```

## Usage

```bash
npm run make-core-feature
```

## Folder directory

```bash
modules/
├── domain/
│   └── name/
│       ├── name.repository.ts
│       └── nameRepository.interface.ts
└── [web|mobile|spa]/
    └── names/
        ├── controllers/index.ts
        ├── resources/index.ts
        ├── resources/show.ts
        ├── routes/index.ts
        ├── services/index.ts
        └── validations/index.ts
```
