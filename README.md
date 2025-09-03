# Sistema de gestión automatizada de documentos de procuradores - AutoProc

🎥 Demo del proyecto:
[Ver demo del proyecto](https://drive.google.com/file/d/1Us6_tYPvIXM7suYMvo0hK7QCvunUiyoZ/view?usp=drive_link)

📌 Poster del proyecto:
<p align="left">
  <img src="./AutoProc - Unai Roa - TFG.png" alt="Poster del proyecto" width="450">
</p>

---

## Overview  
**AutoProc** (Automated Document Management System for Legal Procurators) is a web-based application designed to automate document workflows in the Spanish legal system, specifically for procurators.  

The system processes PDF documents, extracts legal identifiers (NIGs), matches them against lawyer and case databases, and automatically generates email notifications to relevant parties.  

---

## Purpose and Scope
### Key Capabilities
| Feature                 | Description |
|--------------------------|-------------|
| Document Processing      | Extracts NIGs from PDF files and processes legal documents |
| Data Management          | Manages lawyers and cases with encrypted storage |
| Automated Notifications  | Sends email notifications based on document processing results |
| Multi-tenant Architecture| Isolated data storage per user with individual databases |
| Bulk Data Operations     | Excel/JSON upload for mass data import |
| User Management          | Registration, authentication, and trial scheduling |

---

## System Architecture Overview
AutoProc sigue una arquitectura moderna de aplicación web con clara separación entre frontend, backend y capa de datos.  

<!-- Insert image here: High-Level System Components -->
![System Components](https://github.com/user-attachments/assets/7d20cba9-959c-40c4-8184-df1cbfb40de8)  

---

## Technology Stack
### Frontend
- **React 18** – UI framework con hooks y context  
- **Vite** – Build tool y servidor de desarrollo  
- **React Router** – Routing del lado del cliente con `AppRoutes`  
- **Tailwind CSS** – Estilos con utilidades  

### Backend
- **Flask** – Framework web en Python con arquitectura blueprint  
- **PyMongo** – Driver de MongoDB para Python  
- **Flask-JWT-Extended** – Autenticación con tokens JWT  
- **Flask-CORS** – Soporte para cross-origin requests  

### Data & Security
- **MongoDB** – Base de datos documental con arquitectura multi-tenant  
- **AES Encryption** – Encriptación simétrica de campos sensibles  
- **bcrypt** – Hashing seguro de contraseñas  
- **JWT** – JSON Web Tokens para sesiones  

---

## Core Application Flow
Pipeline de procesamiento de documentos y notificaciones automáticas.  

<!-- Insert image here: Document Processing Pipeline -->
![Document Processing Pipeline](https://github.com/user-attachments/assets/430a8379-de09-4dd3-9a78-fd41eaf0f418)  

---

## Multi-Tenant Security Model
AutoProc implementa un modelo multi-tenant avanzado donde cada usuario opera en completo aislamiento de datos.

### Security Architecture
| Component        | Implementation                      | Purpose |
|------------------|-------------------------------------|---------|
| Authentication   | JWT tokens + API keys              | User identity verification |
| Authorization    | Dynamic database selection         | User-specific data access |
| Data Encryption  | AES encryption service             | Sensitive field protection |
| Password Security| Hash encryption service (bcrypt)   | Secure credential storage |
| Database Isolation| `user_{user_id}` databases        | Complete tenant separation |

<!-- Insert image here: Data Isolation Pattern -->
![Security Model](https://github.com/user-attachments/assets/bf636ef1-472a-48a0-acd3-a2fa63792d43)  

---

## Key Architectural Patterns
- **Blueprint Architecture** – Organización modular en Flask (`users_routes`, `lawyers_routes`, `cases_routes`, `notifications_routes`)  
- **Service Layer Pattern** – Lógica de negocio en módulos de servicio dedicados (`users_services`, `lawyers_services`, etc.)  
- **Context Provider Pattern** – Gestión de estado en React con `AuthContext` y `ToastProvider`  
- **Protected Routes** – Páginas autenticadas protegidas con `PrivateRoute`  
- **Encryption Layer** – Capa de encriptación consistente (AES + Hash)  
- **Multi-Database Tenancy** – Una base de datos aislada por usuario (`user_{user_id}`)  

---
