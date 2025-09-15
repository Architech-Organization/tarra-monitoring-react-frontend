# Tarra Monitoring React Frontend

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.4-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.4-green.svg)](https://vitejs.dev/)
[![Material-UI](https://img.shields.io/badge/MUI-5.16.7-blue.svg)](https://mui.com/)
[![Azure AD](https://img.shields.io/badge/Azure%20AD-Integrated-blue.svg)](https://azure.microsoft.com/en-us/services/active-directory/)

Enterprise-grade React frontend for the Tarra vibration monitoring system with real-time analytics, Azure AD authentication, and comprehensive security features.

## 🚀 Features

- **🔐 Security First**: Built with OWASP security best practices
- **🔑 Azure AD Integration**: Enterprise-grade authentication and authorization
- **📊 Real-time Monitoring**: Live sensor data visualization and alerts
- **📱 Progressive Web App**: Offline support and mobile-responsive design
- **♿ Accessibility**: WCAG 2.1 AA compliant with full keyboard navigation
- **🎨 Modern UI**: Material-UI design system with dark/light themes
- **📈 Advanced Analytics**: Interactive charts and data visualization
- **🔄 Real-time Updates**: WebSocket connections for live data
- **⚡ Performance**: Code splitting, lazy loading, and optimized builds
- **🧪 Testing**: Comprehensive test coverage with Vitest and Testing Library

## 🏗️ Architecture

```
src/
├── components/          # Reusable UI components
├── pages/              # Route-level page components
├── hooks/              # Custom React hooks
├── services/           # API and external service integrations
├── store/              # State management (Zustand)
├── utils/              # Utility functions and helpers
├── types/              # TypeScript type definitions
├── config/             # Configuration files
├── assets/             # Static assets
└── styles/             # Global styles and themes
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- Azure AD tenant with configured app registration

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/arch-faustocorrea/tarra-monitoring-react-frontend.git
   cd tarra-monitoring-react-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   VITE_AZURE_CLIENT_ID=your-azure-client-id
   VITE_AZURE_TENANT_ID=your-azure-tenant-id
   VITE_AZURE_REDIRECT_URI=http://localhost:3000
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Azure AD Setup

1. Create an App Registration in Azure Portal
2. Configure redirect URIs for your environment
3. Set API permissions for your backend API
4. Create app roles for user authorization
5. Update environment variables with your tenant and client IDs

### API Integration

The frontend connects to the Tarra Monitoring Backend API. Ensure the backend is running and accessible at the configured `VITE_API_BASE_URL`.

## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run unit tests |
| `npm run test:ui` | Run tests with UI |
| `npm run test:coverage` | Run tests with coverage |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | Run TypeScript type checking |
| `npm run security:audit` | Run security audit |

## 🔒 Security Features

### OWASP Compliance

- **Content Security Policy (CSP)**: Prevents XSS attacks
- **Secure Headers**: X-Frame-Options, X-Content-Type-Options, etc.
- **Input Validation**: Client-side validation with Zod schemas
- **Authentication**: Azure AD OAuth 2.0 with PKCE
- **Authorization**: Role-based access control (RBAC)
- **HTTPS Enforcement**: Secure communication in production
- **Dependency Scanning**: Automated vulnerability checks

### Data Protection

- **Session Storage**: Secure token storage
- **Data Sanitization**: XSS prevention
- **API Security**: Secure HTTP headers and CORS policy
- **Privacy**: No PII logging in production builds

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📊 Monitoring Data Sources

The application supports multiple sensor types:

### Hoskin M80 Sensors
- Multi-channel PPV measurements
- Peak frequency analysis
- Air overpressure monitoring
- Temperature and battery status

### Sixense Vibration Sensors  
- 3-axis acceleration data
- Displacement measurements
- Real-time alarm status
- Location-based monitoring

## 🎨 Theming and Customization

The application uses Material-UI's theming system with:

- **Light/Dark modes**: Automatic system preference detection
- **Custom color palette**: Brand-specific colors and gradients  
- **Responsive typography**: Accessible font scaling
- **Component customization**: Consistent design tokens

## 🔄 State Management

- **React Query**: Server state management and caching
- **Zustand**: Client-side state management
- **Context API**: Theme and authentication state
- **Local Storage**: User preferences persistence

## 📱 Progressive Web App

- **Offline Support**: Service worker caching
- **Install Prompt**: Add to home screen functionality
- **Push Notifications**: Real-time alert delivery
- **Background Sync**: Data synchronization when online

## 🧪 Testing Strategy

### Unit Tests
- Component testing with React Testing Library
- Hook testing with dedicated test utilities
- Utility function testing with Vitest

### Integration Tests
- API integration testing with MSW (Mock Service Worker)
- Authentication flow testing
- End-to-end user scenarios

### Security Testing
- Dependency vulnerability scanning
- Static code analysis
- OWASP security test suites

## 🚀 Deployment

### Production Build

```bash
npm run build
npm run preview
```

### Docker Deployment

```bash
# Build the image
docker build -t tarra-monitoring-frontend .

# Run the container
docker run -p 3000:3000 tarra-monitoring-frontend
```

### Environment-Specific Builds

- **Development**: Source maps, debug tools enabled
- **Staging**: Production optimizations with debugging
- **Production**: Minified, optimized, secure headers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Security and accessibility rules
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Standardized commit messages

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- **Documentation**: Check the `/docs` folder
- **Issues**: Open a GitHub issue
- **Email**: support@yourcompany.com

## 🔗 Related Projects

- [Tarra Monitoring Backend](https://github.com/Architech-Organization/tarra-monitoring-backend) - FastAPI backend service
- [Tarra Monitoring Documentation](https://github.com/Architech-Organization/tarra-monitoring-docs) - System documentation

## 📈 Performance

- **Lighthouse Score**: 95+ across all categories
- **Bundle Size**: < 500KB gzipped
- **Load Time**: < 2 seconds on 3G
- **Code Splitting**: Route-based lazy loading

## 🔍 Monitoring and Analytics

- **Error Tracking**: Integrated error boundary system
- **Performance Monitoring**: Web Vitals tracking
- **User Analytics**: Privacy-compliant usage tracking
- **Security Monitoring**: Authentication and authorization logs

---

**Built with ❤️ by the Architech Organization team**
