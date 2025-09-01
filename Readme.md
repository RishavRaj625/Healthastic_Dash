# Health Dashboard - AI-Powered Healthcare Solution

A comprehensive healthcare management platform that combines artificial intelligence with intuitive user interfaces to provide personalized health recommendations, appointment management, and medical assistance.

## 🌟 Features

### Core Healthcare Features
- **Vision & Voice Interface** - AI-powered voice commands and visual recognition for accessibility
- **OCR Prescription Reader** - Machine learning-based prescription text recognition and analysis
- **Medicine Finder & Comparison** - Smart medicine search with price comparison and similarity matching
- **Diet Recommendations** - Personalized nutrition advice using AI
- **Appointment Booking** - Streamlined healthcare appointment scheduling
- **Medicine Reminder** - Smart medication tracking and reminders
- **Doctor Finder** - Location-based doctor and clinic discovery
- **Blood Bank Locator** - Emergency blood bank finder with real-time availability
- **RAG-based Medical Consultation** - Retrieval-Augmented Generation system for accurate medical guidance

## 🛠 Technology Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect)
- **Routing**: React Router (if applicable)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Automation**: n8n workflow automation
- **ML Services**: Flask (Python)

### AI & Machine Learning
- **AI Provider**: Gemini API
- **Custom Models**: 
  - OCR model for prescription reading
  - RAG (Retrieval-Augmented Generation) system for medical predictions
  - Machine learning models for healthcare recommendations

## 📁 Project Structure

```
health-dashboard/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Dashboard.jsx                    # Main dashboard with tab functionality
│   │   ├── HealthContainer.jsx
│   │   ├── FeatureViewer.jsx               # Feature component renderer
│   │   └── feature-files/                  # Individual feature components
│   │       ├── vision-voice-feature.jsx
│   │       ├── diet-recommendations-feature.jsx
│   │       ├── blood-bank-feature.jsx
│   │       ├── medicine-finder-feature.jsx
│   │       ├── appointment-booking-feature.jsx
│   │       ├── medicine-reminder-feature.jsx
│   │       ├── ocr-prescription-feature.jsx
│   │       ├── finding-nearest-doctor-feature.jsx
│   │       ├── medicine-similarity.jsx
│   │       └── medicine-comparison-feature.jsx
│   ├── pages/                              # Standalone feature pages
│   │   ├── FeaturePage.jsx
│   │   ├── VisionVoicePage.jsx
│   │   ├── DietRecommendationsPage.jsx
│   │   ├── BloodBankPage.jsx
│   │   ├── MedicineFinderPage.jsx
│   │   ├── AppointmentBookingPage.jsx
│   │   ├── MedicineReminderPage.jsx
│   │   ├── OCRPrescriptionPage.jsx
│   │   ├── FindingDoctorPage.jsx
│   │   └── DevelopmentNoticePage.jsx
│   ├── utils/                              # Utility functions
│   │   ├── newTabHandler.js
│   │   └── featureUtils.js
│   ├── styles/                             # Custom styles
│   │   ├── animations.css
│   │   └── feature-pages.css
│   ├── App.jsx
│   ├── App.css
│   └── index.js
├── public/
│   ├── index.html
│   └── feature-templates/                  # HTML templates for new tabs
│       ├── feature-template.html
│       └── development-template.html
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Python 3.8+ (for Flask services)

### Frontend Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd health-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install required packages**
   ```bash
   npm install react react-dom
   npm install lucide-react
   npm install tailwindcss
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

# Get started with Tailwind CSS by using react-vite
1. Create your project
   ```bash
   npm create vite@latest my-app -- --template react
   cd my-app
   npm install
   ```
2. Install Tailwind CSS
   ```bash
   npm install tailwindcss @tailwindcss/vite
   ```
3. Configure the Vite plugin
: Add the @tailwindcss/vite plugin to your Vite configuration(vite.config.js)
   ```bash
       import { defineConfig } from 'vite'
       import react from '@vitejs/plugin-react'
       import tailwindcss from '@tailwindcss/vite'

       export default defineConfig({
         plugins: [
         react(),
         tailwindcss(),
         ],
       })

   ```
4. Import Tailwind CSS
: Add an @import to your CSS file that imports Tailwind CSS(src/index.css)

   ```bash
      @import "tailwindcss";
   ```
5. Start your build process
: Run your build process with npm run dev or whatever command is configured in your package.json file.
   ```bash
         npm run dev
   ```

### Backend Setup

1. **Node.js/Express API**
   ```bash
   cd backend
   npm install express cors dotenv
   npm start
   ```

2. **Flask ML Services**
   ```bash
   cd ml-services
   pip install flask tensorflow scikit-learn pandas numpy
   python app.py
   ```

3. **n8n Automation**
   ```bash
   npm install n8n -g
   n8n start
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_BACKEND_URL=http://localhost:3001
VITE_FLASK_ML_URL=http://localhost:5000
VITE_N8N_WEBHOOK_URL=your_n8n_webhook_url
```

### API Configuration

The application uses URL parameters to navigate between features:

```javascript
// Feature URL mapping
const featureMapping = {
  "vision-voice": VisionVoiceFeature,
  "diet-recommendations": dietRecommendationsFeature,
  "blood-bank": bloodBankFeature,
  "appointment-booking": AppointmentBookingFeature,
  "medicine-reminder": medicineReminderFeature,
  "finding-doctor": findingNearestDoctorFeature,
  "ocr-prescription": ocrPrescriptionFeature,
  "medicine-price": MedicinePriceFinder,
  "product-search": medicineSimilarityFeature,
  "medicine-comparison": medicineComparisonFeature,
};
```

## 🤖 AI Integration

### Gemini API Integration
- Natural language processing for health queries
- Personalized recommendations based on user input(Diet recommendations)
- Multi-modal AI capabilities for vision and voice features

### Custom ML Models
- **OCR Model**: Trained for prescription text recognition with high accuracy
- **RAG System**: Retrieval-Augmented Generation for medical knowledge base queries
- **Recommendation Engine**: Personalized diet and medication suggestions

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern Aesthetics**: Gradient backgrounds, glass-morphism effects, and smooth animations
- **Accessibility**: Voice control and screen reader compatibility
- **Tab-based Navigation**: Multi-tab interface for better user experience
- **Real-time Updates**: Live data synchronization across components

## 📱 Feature Access

Features can be accessed via URL parameters:
- Vision & Voice: `?feature=vision-voice`
- Diet Recommendations: `?feature=diet-recommendations`
- Blood Bank: `?feature=blood-bank`
- Appointment Booking: `?feature=appointment-booking`
- Medicine Reminder: `?feature=medicine-reminder`
- Doctor Finder: `?feature=finding-doctor`
- OCR Prescription: `?feature=ocr-prescription`
- Medicine Price: `?feature=medicine-price`
- Product Search: `?feature=product-search`
- Medicine Comparison: `?feature=medicine-comparison`

## 🧪 Development Status

### ✅ Completed Features
- Dashboard with tab functionality
- Vision & Voice interface
- Diet recommendations system
- Blood bank locator
- Appointment booking system
- Medicine reminder functionality
- OCR prescription reader
- Doctor finder service
- Medicine price comparison
- Medicine similarity search

### 🔄 In Development
- RAG-based medical consultation
- Advanced ML model improvements
- Enhanced UI animations
- Mobile app version

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@healthdashboard.ai or join our Slack channel.

## 🙏 Acknowledgments

- Gemini AI for powering our AI capabilities
- React community for excellent documentation
- Tailwind CSS for beautiful styling utilities
- Lucide React for comprehensive icon library

---

**Note**: This is an AI-powered healthcare platform. Always consult with qualified healthcare professionals for medical decisions.
