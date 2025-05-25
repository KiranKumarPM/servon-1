import { createTheme, alpha } from '@mui/material/styles';

// Enhanced animation keyframes
const fadeInKeyframes = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const floatKeyframes = `
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
`;

const pulseKeyframes = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;

const shimmerKeyframes = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

const bounceKeyframes = `
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    40% { transform: translateY(-20px); }
    60% { transform: translateY(-10px); }
  }
`;

const glowKeyframes = `
  @keyframes glow {
    0% { box-shadow: 0 0 5px rgba(138, 43, 226, 0.5); }
    50% { box-shadow: 0 0 20px rgba(138, 43, 226, 0.8), 0 0 30px rgba(218, 112, 214, 0.6); }
    100% { box-shadow: 0 0 5px rgba(138, 43, 226, 0.5); }
  }
`;

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6d28d9', // Deep purple
      light: '#8b5cf6',
      dark: '#5b21b6',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#db2777', // Pink
      light: '#ec4899',
      dark: '#be185d',
      contrastText: '#ffffff',
    },
    info: {
      main: '#06b6d4', // Cyan
      light: '#22d3ee',
      dark: '#0891b2',
    },
    success: {
      main: '#10b981', // Emerald
      light: '#34d399',
      dark: '#059669',
    },
    warning: {
      main: '#f59e0b', // Amber
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: '#ef4444', // Red
      light: '#f87171',
      dark: '#dc2626',
    },
    background: {
      default: 'linear-gradient(135deg, #f8fafc 0%, #ede9fe 100%)', // Light gradient background
      paper: '#ffffff',
      accent: alpha('#6d28d9', 0.08),
      card: '#f9fafb',
      darker: '#f1f5f9',
      lighter: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#475569',
      accent: '#6d28d9',
      muted: '#64748b',
    },
    divider: 'rgba(148, 163, 184, 0.12)',
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        ${fadeInKeyframes}
        ${floatKeyframes}
        ${pulseKeyframes}
        ${shimmerKeyframes}
        ${bounceKeyframes}
        ${glowKeyframes}
        
        :root {
          --purple-gradient: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
          --pink-gradient: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
          --blue-gradient: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          --green-gradient: linear-gradient(135deg, #10b981 0%, #059669 100%);
          --transition-standard: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          background: linear-gradient(135deg, #f8fafc 0%, #ede9fe 100%);
          color: #1e293b;
          transition: var(--transition-standard);
          font-feature-settings: "cv02", "cv03", "cv04", "cv11";
        }
        
        * {
          box-sizing: border-box;
        }
        
        a {
          text-decoration: none;
          color: inherit;
          transition: var(--transition-standard);
        }
        
        .App {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        
        .floating {
          animation: float 4s ease-in-out infinite;
        }
        
        .pulsing {
          animation: pulse 2.5s ease-in-out infinite;
        }
        
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        
        .bounce {
          animation: bounce 2s infinite;
        }
        
        .glow {
          animation: glow 3s infinite;
        }
        
        .glass {
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          background-color: rgba(255, 255, 255, 0.8) !important;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        .gradient-text {
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          background-image: var(--purple-gradient);
        }
      `,
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          '&.scrolled': {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
          },
        },
      },
      defaultProps: {
        elevation: 0,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontWeight: 600,
          letterSpacing: '0.01em',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            background: 'rgba(255, 255, 255, 0.1)',
            transform: 'translateX(-100%)',
            transition: 'transform 0.6s ease-out',
            pointerEvents: 'none',
          },
          '&:hover::after': {
            transform: 'translateX(0)',
          },
          '& .MuiTouchRipple-child': {
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            borderRadius: '50%',
          },
          '&.MuiButton-fullWidth': {
            boxShadow: '0 4px 10px rgba(109, 40, 217, 0.2)',
            '&:hover': {
              boxShadow: '0 6px 15px rgba(109, 40, 217, 0.3)',
              transform: 'translateY(-2px)',
            },
            '&:active': {
              boxShadow: '0 2px 5px rgba(109, 40, 217, 0.2)',
              transform: 'translateY(1px)',
            },
          },
          '&:active::after': {
            backgroundImage: 'radial-gradient(circle, #fff 10%, transparent 10.01%)',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '50%',
            transform: 'scale(0, 0)',
            opacity: 0.3,
            transition: '0s',
          },
        },
        contained: {
          backgroundImage: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
          boxShadow: '0 10px 20px -10px rgba(139, 92, 246, 0.5)',
          '&:hover': {
            backgroundImage: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
            transform: 'translateY(-3px) scale(1.02)',
            boxShadow: '0 14px 28px -10px rgba(139, 92, 246, 0.6)',
          },
          '&:active': {
            transform: 'translateY(1px)',
          },
        },
        containedSecondary: {
          backgroundImage: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
          boxShadow: '0 10px 20px -10px rgba(236, 72, 153, 0.5)',
          '&:hover': {
            backgroundImage: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
            transform: 'translateY(-3px) scale(1.02)',
            boxShadow: '0 14px 28px -10px rgba(236, 72, 153, 0.6)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            borderColor: '#8b5cf6',
            transform: 'translateY(-2px)',
          },
        },
        text: {
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: '50%',
            width: 0,
            height: '2px',
            backgroundColor: '#8b5cf6',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: 'translateX(-50%)',
          },
          '&:hover::before': {
            width: '80%',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: '#ffffff',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          overflow: 'hidden',
          border: '1px solid rgba(0, 0, 0, 0.04)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(109, 40, 217, 0.08) 0%, rgba(109, 40, 217, 0) 50%)',
            opacity: 0,
            transition: 'opacity 0.5s ease',
          },
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: '0 20px 30px -10px rgba(0, 0, 0, 0.1), 0 0 15px rgba(109, 40, 217, 0.15)',
            '&::before': {
              opacity: 1,
            },
          },
          '&.glass': {
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          },
          '&.bordered': {
            borderTop: '4px solid #6d28d9',
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          borderRadius: 8,
          margin: '4px 8px',
          padding: '10px 16px',
          '&:hover': {
            backgroundColor: 'rgba(109, 40, 217, 0.08)',
            paddingLeft: 24,
            transform: 'translateX(4px)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: '50%',
            height: 0,
            width: 3,
            backgroundColor: '#6d28d9',
            transition: 'height 0.3s ease, transform 0.3s ease',
            transform: 'translateY(-50%)',
            borderRadius: 4,
          },
          '&:hover::before': {
            height: '70%',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(109, 40, 217, 0.1)',
            '&::before': {
              height: '70%',
              width: 3,
              background: 'linear-gradient(to bottom, #6d28d9, #8b5cf6)',
            },
            '&:hover': {
              backgroundColor: 'rgba(109, 40, 217, 0.15)',
            },
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          flex: 1,
          position: 'relative',
          '@media (max-width: 600px)': {
            paddingLeft: 20,
            paddingRight: 20,
          },
          '&.page-container': {
            paddingTop: 40,
            paddingBottom: 40,
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#8b5cf6',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#8b5cf6',
              borderWidth: 2,
              boxShadow: '0 0 0 4px rgba(139, 92, 246, 0.1)',
            },
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          position: 'relative',
          color: '#8b5cf6',
          textDecoration: 'none',
          transition: 'all 0.3s ease',
          '&::after': {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '1px',
            bottom: 0,
            left: 0,
            backgroundColor: '#8b5cf6',
            transform: 'scaleX(0)',
            transformOrigin: 'bottom right',
            transition: 'transform 0.3s ease',
          },
          '&:hover': {
            color: '#a78bfa',
            '&::after': {
              transform: 'scaleX(1)',
              transformOrigin: 'bottom left',
            },
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: 'rgba(139, 92, 246, 0.15)',
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(148, 163, 184, 0.15)',
          '&.gradient': {
            border: 'none',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5), transparent)',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          padding: '8px 12px',
          fontSize: '0.85rem',
          borderRadius: 8,
          color: '#1e293b',
        },
        arrow: {
          color: 'rgba(255, 255, 255, 0.95)',
        },
      },
    },
  },
});

export default theme;
     