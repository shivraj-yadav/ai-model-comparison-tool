# AI Model Comparison Tool

A powerful web application that allows you to compare responses from multiple AI models simultaneously using OpenRouter's unified API. Built with React, TypeScript, and modern UI components.

## ✨ Features

- **Multi-Model Comparison**: Send the same message to multiple AI models at once
- **Real-time Responses**: See responses from all models in parallel
- **Model Selection**: Choose from a wide variety of AI models including GPT-4, Claude, Gemini, and more
- **Response Evaluation**: Pick the best response and copy it to clipboard
- **Usage Tracking**: Monitor token usage for each model
- **Beautiful UI**: Modern, responsive interface built with shadcn/ui and Tailwind CSS
- **TypeScript**: Full type safety and better development experience

## 🤖 Supported Models

The application supports various AI models through OpenRouter:

- **OpenAI**: GPT-4o, GPT-4o Mini
- **Anthropic**: Claude 3.5 Sonnet, Claude 3 Haiku
- **Google**: Gemini Pro
- **Meta**: Llama 3.1 (8B & 70B Instruct)
- **Mistral AI**: Mistral 7B Instruct
- **Perplexity**: Llama 3.1 8B
- **Nous Research**: Nous Hermes 2 Mixtral

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- OpenRouter API key

### 1. Get OpenRouter API Key

1. Visit [OpenRouter](https://openrouter.ai/keys)
2. Sign up for a free account
3. Generate an API key
4. Copy your API key (starts with `sk-or-v1-`)

### 2. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-model-comparison-tool.git
cd ai-model-comparison-tool

# Install dependencies
npm install

# Configure API key
cp .env.example .env
# Edit .env and add your OpenRouter API key
```

### 3. Configure API Key

**Option A: Environment Variable (Recommended)**
Create a `.env` file in the project root:
```env
VITE_OPENROUTER_API_KEY=sk-or-v1-your-api-key-here
```

**Option B: In-App Configuration**
1. Run the application
2. Enter your API key in the configuration screen
3. The key will be stored locally in your browser

### 4. Start Development Server

```bash
npm run dev
```

### 5. Open the Application

Navigate to `http://localhost:5173` in your browser.

## 📖 Usage

1. **Configure API Key**: If not set via environment variable, enter your OpenRouter API key
2. **Select Models**: Choose which AI models you want to compare
3. **Ask Questions**: Type your question in the input box and press Enter
4. **Compare Responses**: View responses from all selected models simultaneously
5. **Pick the Best**: Click "Pick" on your favorite response to mark it as the best
6. **Copy Responses**: Use the "Copy" button to copy any response to your clipboard

## 🏗️ Project Structure

```
src/
├── components/
│   ├── AIModelComparison.tsx    # Main comparison interface
│   ├── ModelChat.tsx           # Individual model chat component
│   ├── ModelSelector.tsx       # Model selection interface
│   ├── ApiKeyConfig.tsx        # API key configuration
│   └── ui/                     # shadcn/ui components
├── hooks/
│   ├── use-chat.ts             # Chat state management
│   └── use-toast.ts            # Toast notifications
├── lib/
│   ├── openrouter.ts           # OpenRouter API integration
│   └── utils.ts                # Utility functions
└── pages/
    └── Index.tsx               # Main page
```

## 🛠️ Technologies Used

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **State Management**: React Hooks, Custom Hooks
- **API Integration**: OpenRouter API, OpenAI SDK
- **Styling**: Tailwind CSS with custom gradients and animations
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔒 Security

- API keys are stored locally in your browser's localStorage
- For production use, consider implementing a backend proxy
- Never commit API keys to version control

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [OpenRouter](https://openrouter.ai/) for providing unified access to multiple AI models
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Vite](https://vitejs.dev/) for the fast build tool
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.
