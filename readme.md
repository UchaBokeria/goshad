# GoShad UI


A comprehensive, modern UI component library for Go web applications built with [a-h/templ](https://github.com/a-h/templ), [Tailwind CSS](https://tailwindcss.com/), and [DaisyUI](https://daisyui.com/).

[![Go Version](https://img.shields.io/badge/go-1.24.4+-blue.svg)](https://golang.org)
[![Templ](https://img.shields.io/badge/templ-0.3.898+-green.svg)](https://github.com/a-h/templ)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Purpose

GoShad UI bridges the gap between Go's robust backend capabilities and modern frontend user experience. It provides a type-safe, component-based approach to building beautiful web UIs directly in Go, eliminating the need for separate frontend frameworks while maintaining design consistency and accessibility standards.

### Core Philosophy

- **Type Safety**: All components are type-safe with Go structs defining props and configurations
- **Composability**: Components can be combined and nested to create complex interfaces
- **Accessibility**: Built-in ARIA compliance and keyboard navigation support
- **Performance**: Server-side rendering with minimal client-side JavaScript
- **Developer Experience**: Intuitive API with comprehensive examples and documentation

## Quick Start

### Installation

```bash
go mod init your-project
go get github.com/UchaBokeria/goshad
go get github.com/a-h/templ
```

### Basic Usage

```go
package main

import (
    "net/http"
    "github.com/UchaBokeria/goshad/ui"
    "github.com/a-h/templ"
)

func main() {
    // Create a simple page with GoShad components
    page := ui.Container(ui.ContainerProps{
        Size: "lg", Centered: true, Padding: "lg",
    }) {
        ui.HeadingWithText(ui.HeadingProps{
            Level: 1, Size: "4xl", Weight: "bold", Color: "primary",
        }, "Welcome to GoShad")
        
        ui.ButtonText("Get Started", ui.ButtonProps{
            Variant: "primary", Size: "lg",
        })
    }
    
    http.Handle("/", templ.Handler(page))
    http.ListenAndServe(":8080", nil)
}
```

### Development Server

```bash
# Run the development server with examples
make dev
# or
go run cmd/main.go
```

Visit `http://localhost:5050` to view the component gallery and examples.

## Architecture

### Technology Stack

- **Backend**: Go 1.24+ with net/http
- **Templating**: a-h/templ for type-safe HTML generation
- **Styling**: Tailwind CSS for utility-first styling
- **Component Framework**: DaisyUI for consistent design system
- **JavaScript**: Minimal, progressive enhancement only

### Project Structure

```
goshad/
├── ui/                  # Core UI primitives
│   ├── button.templ     # Button components
│   ├── input.templ      # Form inputs
│   ├── card.templ       # Card layouts
│   └── ...              # Other primitives
├── components/          # Complex composite components
│   ├── modal.templ      # Modal dialogs
│   ├── navigation.templ # Navigation menus
│   ├── tabs.templ       # Tab interfaces
│   └── ...              # Other components
├── examples/            # Component demos and documentation
├── cmd/                 # Development server
└── static/              # Static assets
```

## Component Catalog

### 🎨 UI Primitives (`ui/`)

**Layout & Structure**
- `Container` - Responsive content wrapper with size and padding controls
- `Card` - Content cards with variants (bordered, compact, side, glass)
- `Grid` - CSS Grid layouts with responsive column/row configuration
- `Flex` - Flexbox layouts with direction, justify, align controls
- `Stack` - Vertical/horizontal stacking with gap controls
- `Separator` - Visual dividers with orientation and styling

**Typography**
- `Heading` - Semantic headings (H1-H6) with size, weight, color options
- `Text` - Styled text with size, weight, alignment, and transformation
- `Link` - Interactive links with variants and external link indicators

**Form Elements**
- `Input` - Text inputs with validation, sizing, and error states
- `Textarea` - Multi-line text inputs with auto-resize
- `Select` - Dropdown selectors with options and multi-select
- `Checkbox` - Checkboxes with custom styling
- `Radio` - Radio button groups
- `Switch` - Toggle switches with variants
- `Slider` - Range sliders with min/max and step controls
- `Form` - Form wrappers with spacing and validation
- `FormField` - Complete form fields with labels, descriptions, errors

**Interactive Elements**
- `Button` - Buttons with variants (primary, secondary, outline, ghost, etc.)
- `Badge` - Status indicators and labels
- `Tooltip` - Contextual help and information overlays
- `Avatar` - User profile images with fallbacks and status indicators
- `Progress` - Progress bars and loading indicators
- `Spinner` - Loading spinners with different styles

**Data Display**
- `Table` - Data tables with sorting, pagination, and responsive design
- `List` - Ordered/unordered lists with custom styling
- `Image` - Responsive images with aspect ratios and lazy loading
- `Icon` - SVG icon system with size and color controls
- `Quote` - Blockquotes and testimonials
- `Alert` - Status messages and notifications

**Specialized Inputs**
- `DateRange` - Date range pickers with calendar interface
- `TimePicker` - Time selection with format options
- `YearPicker` - Year selection interface
- `Multiselect` - Multi-option selection with search
- `PasswordInput` - Password fields with visibility toggle

### 🧩 Composite Components (`components/`)

**Navigation**
- `Navigation` - Main navigation with brand, items, and actions
- `Menu` - Sidebar and dropdown menus with nested items
- `Breadcrumbs` - Hierarchical navigation with separators
- `Menubar` - Horizontal menu bars with dropdowns
- `ContextMenu` - Right-click context menus

**Overlays & Dialogs**
- `Modal` - Dialog overlays with sizes and positions
- `Dialog` - HTML5 dialog elements with custom styling
- `Popover` - Contextual content overlays
- `Sheet` - Slide-out panels from screen edges
- `Drawer` - Side navigation panels

**Interactive Content**
- `Tabs` - Tabbed interfaces with content panels
- `Accordion` - Collapsible content sections
- `Collapsible` - Individual collapsible items
- `Carousel` - Image/content sliders with navigation
- `Dropdown` - Custom dropdown menus with complex content

**Complex Inputs**
- `TagsInput` - Multi-tag input with suggestions
- `Combobox` - Searchable select with filtering
- `Search` - Search interfaces with results
- `OTP` - One-time password input grids
- `Rating` - Star ratings with interaction

**Data Visualization**
- `Chart` - Data visualization components
- `Stat` - Statistics display with trends
- `Timeline` - Event timelines and process flows
- `Steps` - Step-by-step process indicators

**Layout Components**
- `Pagination` - Page navigation with ellipsis
- `Overlay` - Background overlays and backdrops
- `Clipboard` - Copy-to-clipboard functionality
- `Toast` - Notification toasts and alerts

### 📱 Responsive Design

All components include responsive design patterns:

```go
// Responsive grid example
ui.Grid(ui.GridProps{
    Cols: "1",        // Default: 1 column
    Class: "md:grid-cols-2 lg:grid-cols-3", // Responsive: 2 cols on md, 3 on lg
    Gap: "4",
})

// Responsive text sizing
ui.Text(ui.TextProps{
    Size: "base",
    Class: "md:text-lg lg:text-xl", // Larger text on bigger screens
})
```

## Usage Patterns

### Form Building

```go
// Complete form with validation
ui.Form(ui.FormProps{Method: "POST", Action: "/submit"}) {
    ui.FormFieldWithInput(
        ui.FormFieldProps{
            Label: "Email Address",
            Description: "We'll never share your email",
            Required: true,
        },
        ui.InputProps{
            Type: "email",
            Placeholder: "john@example.com",
            Size: "md",
        },
    )
    
    ui.FormActions(ui.FormProps{}) {
        ui.ButtonText("Cancel", ui.ButtonProps{Variant: "ghost"})
        ui.ButtonText("Submit", ui.ButtonProps{
            Variant: "primary", Type: "submit",
        })
    }
}
```

### Navigation Setup

```go
// Main application navigation
components.Navigation(components.NavigationProps{
    Brand: components.NavBrand{
        Text: "MyApp", Href: "/",
    },
    Items: []components.NavItem{
        {Label: "Dashboard", Href: "/dashboard", Active: true},
        {Label: "Projects", Href: "/projects"},
        {Label: "Settings", Href: "/settings"},
    },
    Actions: []components.NavAction{
        {Type: "search"},
        {Type: "button", Label: "Sign Out", Variant: "ghost"},
    },
})
```

### Data Display

```go
// Data table with pagination
ui.TableWithData(
    ui.TableProps{Zebra: true, Size: "md"},
    []ui.TableColumn{
        {Header: "Name", Key: "name", Width: "30%"},
        {Header: "Email", Key: "email", Width: "40%"},
        {Header: "Status", Key: "status", Width: "30%"},
    },
    userData, // []ui.TableRow
)
```

### Modal Dialogs

```go
// Confirmation modal
components.Modal(components.ModalProps{
    ID: "confirm-delete",
    Title: "Confirm Deletion",
    Size: "md",
    Backdrop: true,
    Closable: true,
}) {
    ui.ParagraphWithString(ui.TextProps{}, 
        "Are you sure you want to delete this item? This action cannot be undone.")
    
    ui.Flex(ui.FlexProps{Justify: "end", Gap: "2", Class: "mt-4"}) {
        ui.ButtonText("Cancel", ui.ButtonProps{Variant: "ghost"})
        ui.ButtonText("Delete", ui.ButtonProps{Variant: "error"})
    }
}
```

## Integration Guide

### With Popular Go Frameworks

**Echo Framework**
```go
import "github.com/labstack/echo/v4"

func handler(c echo.Context) error {
    component := ui.Card(ui.CardProps{}) {
        ui.HeadingWithText(ui.HeadingProps{Level: 2}, "Hello Echo")
    }
    return templ.Handler(component).ServeHTTP(c.Response(), c.Request())
}
```

**Gin Framework**
```go
import "github.com/gin-gonic/gin"

func handler(c *gin.Context) {
    component := ui.Button(ui.ButtonProps{Variant: "primary"}) {
        templ.Raw("Click me")
    }
    templ.Handler(component).ServeHTTP(c.Writer, c.Request)
}
```

**Chi Router**
```go
import "github.com/go-chi/chi/v5"

r := chi.NewRouter()
r.Get("/", func(w http.ResponseWriter, r *http.Request) {
    component := ui.Container(ui.ContainerProps{}) {
        ui.Text(ui.TextProps{}) { templ.Raw("Hello Chi") }
    }
    templ.Handler(component).ServeHTTP(w, r)
})
```

### HTMX Integration

GoShad works seamlessly with HTMX for dynamic interfaces:

```go
// HTMX-enhanced button
ui.Button(ui.ButtonProps{
    Variant: "primary",
    Class: "htmx-button",
}) {
    templ.Attributes{
        "hx-get": "/api/data",
        "hx-target": "#content",
        "hx-swap": "innerHTML",
    }
    templ.Raw("Load Data")
}
```

### Custom Theming

Extend the default theme using Tailwind CSS:

```javascript
// tailwind.config.js
module.exports = {
  content: ['**/*.templ'],
  theme: {
    extend: {
      colors: {
        primary: "#your-brand-color",
        secondary: "#your-secondary-color",
      }
    }
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ["light", "dark", "custom"],
  }
}
```

## Best Practices

### Component Composition

```go
// Good: Composable components
func UserCard(user User) templ.Component {
    return ui.Card(ui.CardProps{Shadow: "lg"}) {
        ui.Flex(ui.FlexProps{Direction: "row", Align: "center", Gap: "4"}) {
            ui.Avatar(ui.AvatarProps{Src: user.Avatar, Size: "lg"})
            ui.VStack("start", "start", "2", "") {
                ui.HeadingWithText(ui.HeadingProps{Level: 3}, user.Name)
                ui.TextWithString(ui.TextProps{Color: "text-base-content/70"}, user.Email)
            }
        }
    }
}
```

### Error Handling

```go
// Form with error states
ui.FormFieldWithInput(
    ui.FormFieldProps{
        Label: "Username",
        Error: validationError, // Show validation errors
        Required: true,
    },
    ui.InputProps{
        Error: validationError != "",
        ErrorMsg: validationError,
    },
)
```

### Accessibility

Components include built-in accessibility features:
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- Color contrast compliance

## Development

### Prerequisites

- Go 1.24 or higher
- Node.js (for Tailwind CSS compilation)

### Setup

```bash
# Clone the repository
git clone https://github.com/UchaBokeria/goshad.git
cd goshad

# Install dependencies
go mod download
npm install

# Generate templ files
templ generate

# Start development server
make dev
```

### Building

```bash
# Build for production
make build

# Run tests
make test

# Format code
make fmt
```

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-component`)
3. Make your changes and add tests
4. Ensure all tests pass (`make test`)
5. Commit your changes (`git commit -m 'Add amazing component'`)
6. Push to the branch (`git push origin feature/amazing-component`)
7. Open a Pull Request

## API Reference

### Component Props Pattern

All components follow a consistent props pattern:

```go
type ComponentProps struct {
    // Common properties
    Class    string // Additional CSS classes
    Size     string // xs, sm, md, lg, xl
    Variant  string // Component-specific variants
    Disabled bool   // Disable interaction
    
    // Component-specific properties
    // ...
}
```

### Styling System

Components use a layered styling approach:
1. **Base styles**: Default component appearance
2. **Variant styles**: Predefined style variations
3. **Size styles**: Responsive sizing options
4. **Custom classes**: User-provided CSS classes

### Events and Interactions

Components support standard HTML events through the `templ` framework:

```go
ui.Button(ui.ButtonProps{}) {
    templ.Attributes{
        "onclick": "handleClick()",
        "onmouseover": "handleHover()",
    }
    templ.Raw("Interactive Button")
}
```

## Performance

- **Server-side rendering**: All components render on the server
- **Minimal JavaScript**: Only essential interactions require JS
- **CSS optimization**: Tailwind CSS purges unused styles
- **Lazy loading**: Images and heavy components load on demand
- **Caching**: Components can be cached at multiple levels

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers with modern CSS support

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- [a-h/templ](https://github.com/a-h/templ) - Type-safe Go templating
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [DaisyUI](https://daisyui.com/) - Component library for Tailwind CSS
- [Heroicons](https://heroicons.com/) - Beautiful hand-crafted SVG icons

---

**Made with ❤️ for the Go community**