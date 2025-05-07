
# Capital Market License Registry

A web-based application for generating and managing capital market licenses with AI-powered automation.

## Core Functionalities

- **License Generation**: Create professional capital market licenses with customizable fields
- **AI Integration**: Auto-fills license information and compliance requirements
- **Document Export**: Download licenses in PDF, JPG, or Excel format
- **Compliance Tracking**: Automatically generates compliance tables with legal provisions
- **Developer Mode**: Configure AI parameters and models

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn UI
- **Backend**: Supabase (database, authentication, storage)
- **AI Integration**: Pluggable configuration for various AI providers (Groq, OpenAI, etc.)
- **Document Generation**: html2canvas, jsPDF
- **State Management**: React hooks

## Application Structure

### Components

- `LicenseForm.tsx`: Form for entering license details
- `LicensePreview.tsx`: Visual preview of the generated license
- `ComplianceTable.tsx`: Displays regulatory compliance requirements
- `ExportOptions.tsx`: Options for exporting the license in different formats
- `AiConfigPanel.tsx`: UI for configuring AI parameters
- `Header.tsx`: Application header with navigation

### Services

- `aiService.ts`: Service for connecting to and using AI providers
- `Data files`: License types and compliance data

### Pages

- `Index.tsx`: Main application page with tabs for different sections

## AI Configuration

The application supports multiple AI providers:

- Groq (deepseek-r1-distill-llama-70b)
- OpenAI
- Anthropic
- DeepSeek

Parameters that can be configured include:
- Model selection
- Temperature
- Maximum tokens
- Streaming mode

## Database Schema (Supabase)

### Tables

1. **Licenses**
   - id: UUID (primary key)
   - company_name: String
   - license_type: String
   - license_number: String
   - activity_description: String
   - issue_date: Date
   - expiry_date: Date
   - created_at: Timestamp
   - updated_at: Timestamp
   - created_by: UUID (foreign key to users)

2. **LicenseTypes**
   - id: UUID (primary key)
   - name: String
   - description: String
   - act_sections: String[]
   - default_activity: String

3. **ComplianceItems**
   - id: UUID (primary key)
   - license_type_id: UUID (foreign key to license_types)
   - category: String
   - items: String[]
   - reference: String

4. **AIConfigurations**
   - id: UUID (primary key)
   - user_id: UUID (foreign key to users)
   - provider: String
   - model: String
   - temperature: Float
   - max_tokens: Integer
   - streaming: Boolean
   - created_at: Timestamp
   - updated_at: Timestamp

## Setup and Installation

1. Clone this repository
2. Install dependencies with `npm install`
3. Set up a Supabase project and add the connection details
4. Run the development server with `npm run dev`

## Future Enhancements

- OneDrive integration for document backup
- Admin panel for managing license types and legal references
- User management and role-based access control
- Document versioning and approval workflows
- Additional AI model support

## License

This project is proprietary and confidential.

