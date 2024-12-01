# MenuVision

**Revolutionizing menu creation with the power of AI.** MenuVision leverages advanced AI models to generate professional-quality menu visuals, write engaging descriptions, and digitize existing menus using OCR.

[![License](https://img.shields.io/github/license/mohdlatif/menu-generator)](https://github.com/mohdlatif/menu-generator/blob/main/LICENSE)
[![Contributors](https://img.shields.io/github/contributors/mohdlatif/menu-generator)](https://github.com/mohdlatif/menu-generator/graphs/contributors)
[![Stars](https://img.shields.io/github/stars/mohdlatif/menu-generator)](https://github.com/mohdlatif/menu-generator/stargazers)

<p align="center">
  <img src="https://img.playbook.com/qI3rSftRew1SdtJ1G3y-xcFtS6c7aK36lJ200MRVm20/Z3M6Ly9wbGF5Ym9v/ay1hc3NldHMtcHVi/bGljLzMxMTllODJk/LWRjNWYtNGU0ZC05/MzA5LTZkZDhhODJi/MjE3MQ" alt="MenuVision Screenshot" width="600"/> 
</p>

## ✨ Key Features

- **AI-Powered Design:** Create stunning menu visuals effortlessly with our AI, powered by Flex technology. No design skills needed!
- **Automated Content:** Generate compelling and mouthwatering menu descriptions automatically using Gemma 2.
- **OCR Digitization:** Seamlessly convert your existing paper menus into digital format with Gamini 1.5 Flash.
- **Multilingual Support:** Cater to a global audience by creating menus in multiple languages.

## 🚀 Getting Started

### Prerequisites

- Bun javascript runtime

### Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/mohdlatif/menu-generator.git
   cd menu-generator
   bun install
   bun run dev
   ```

### 📊 How It Works

- Upload: Simply upload a menu image.
- Extract: MenuVision automatically identifies and extracts all menu items.
- Enhance: AI generates mouthwatering descriptions and stunning food photos.
- Digitize: Your interactive digital menu is ready to use!

### Technology Stack

    - Frontend: React with TypeScript, Tailwind CSS
    - AI: Google Gemini, Together AI (Gemma-2b-it, FLUX.1-schnell)

### API Endpoints

    - /api/img (Menu Processing) - Extracts menu data from images. Utilizes Google Gemini 1.5 Flash for precise menu text extraction.
    - /api/menuItemDes (Description Generation) - Generates item descriptions. Utilizes Together AI Gemma-2b-it for detailed and engaging descriptions.
    - /api/imgGenerate (Image Generation) - Creates professional food photography. Utilizes Together AI FLUX.1-schnell for high-quality food images.

###Benefits

- Modernize menus: Enhance your online presence with interactive digital menus.
- Save time and effort: Automate menu digitization and eliminate manual data entry.
- Boost appeal: Entice customers with professional food photography and compelling descriptions.
- Increase efficiency: Streamline online ordering and improve customer experience.
