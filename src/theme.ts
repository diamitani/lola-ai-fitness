export const F = {
  display: "'Playfair Display', serif",
  body: "'Nunito', sans-serif",
};

export const C = {
  bg: '#FDF8F5',
  surface: '#FFFFFF',
  card: '#FFF9F6',
  text: '#1C1410',
  muted: '#9B8B80',
  border: '#EDE4DC',
  rose: '#E8826A',
  roseDark: '#C5634A',
  roseLight: '#FDE8E2',
  peach: '#F5C4B0',
  cream: '#FAF1EC',
  green: '#7DB89A',
  greenLight: '#E6F4EE',
  dark: '#2A1F18',
};

export const GS = `
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  background: ${C.bg};
  font-family: ${F.body};
  color: ${C.text};
}
::-webkit-scrollbar {
  width: 0;
  height: 0;
}
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-7px);
  }
}
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
.fu {
  animation: fadeUp 0.45s ease both;
}
.fu1 {
  animation: fadeUp 0.45s 0.07s ease both;
}
.fu2 {
  animation: fadeUp 0.45s 0.14s ease both;
}
.fu3 {
  animation: fadeUp 0.45s 0.21s ease both;
}
.fu4 {
  animation: fadeUp 0.45s 0.28s ease both;
}`;