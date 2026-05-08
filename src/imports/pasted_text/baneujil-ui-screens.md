Create desktop web UI screens for "바느질" (Baneujil),
a Korean AI conflict mediation service.
Desktop web, 1440px wide, warm peach & beige color palette.

=== DESIGN SYSTEM ===
Service name: 바느질
Tagline: 우리 사이, 다시 이어줄게

Color palette (warm & soft):
  Background: #FFF8F4 (warm cream)
  Primary: #FF8C7A (soft peach/coral)
  Primary dark: #E56B58 (hover state)
  Secondary: #F5E6D8 (light beige)
  Accent: #D4956A (warm brown)
  Card background: #FFFFFF
  Text primary: #2C1810 (deep warm brown)
  Text secondary: #8C6B5A (medium warm brown)
  Border: #EDD9CC (soft peach border)
  Success: #6BAF8C (sage green)
  Error: #E57373

Typography:
  Heading font: rounded, friendly (Pretendard or similar)
  Body: 16px / line-height 1.7
  Heading 1: 56px bold
  Heading 2: 36px semibold
  Heading 3: 24px semibold
  All Korean text

Corner radius: 16px cards, 12px inputs, 100px buttons (pill shape)
Shadow: soft warm shadow (rgba(255,140,122,0.12) 0px 8px 32px)

=== SCREEN 1 — MAIN LANDING PAGE ===

HEADER (sticky, 72px height):
  Left: 바느질 logo (small spool+needle icon + text)
  Right: "로그인" (ghost button) + "시작하기" (filled peach button)
  Background: #FFF8F4 with subtle bottom border

HERO SECTION (full viewport height, centered):
  Background: warm cream gradient (top #FFF8F4 → bottom #FDEEE6)
  Subtle decorative elements: soft thread/stitch pattern, very light opacity
  
  Center content (max-width 680px, centered):
    Small badge chip above heading:
      🧵 AI 갈등 중재 서비스
      (peach background, warm brown text, pill shape)
    
    Main heading (56px, bold, warm brown):
      "우리 사이,
      다시 이어줄게"
    
    Subheading (20px, regular, secondary color):
      "두 사람의 이야기를 따로 듣고
      서로를 더 잘 이해할 수 있게 도와드려요"
    
    CTA buttons row (centered, gap 16px):
      Primary: "갈등 중재 시작하기 →"
        (peach fill, white text, pill, 56px height, 220px wide)
      Secondary: "서비스 둘러보기"
        (transparent, peach border, pill)
    
    Social proof below buttons:
      "이미 3,200명이 관계를 회복했어요 💛"
      (small text, secondary color)

  Bottom: scroll indicator arrow, softly animated

FEATURES SECTION (padding 120px vertical):
  Section label: "바느질이 특별한 이유"
  Heading: "두 사람 모두의 이야기를 들어요"
  
  3-column card grid (gap 24px):
  
    Card 1:
      Icon: 🫂 (large, on peach circle background)
      Title: "MBTI 기반 공감"
      Desc: "당신의 MBTI 성향을 깊이 이해하고,
             감정의 원인을 정확하게 짚어드려요"
    
    Card 2:
      Icon: 🔍
      Title: "A·B 독립 입력"
      Desc: "두 사람이 각자 따로 입력해
             편향 없는 중립 분석을 제공해요"
    
    Card 3:
      Icon: 📋
      Title: "갈등 히스토리 누적"
      Desc: "반복되는 갈등 패턴을 파악하고
             더 깊은 인사이트를 드려요"

HOW IT WORKS SECTION (beige background, padding 120px):
  Heading: "이렇게 사용해요"
  
  Horizontal 4-step flow with connecting dotted line:
  
    Step 1: 🅐 A가 입력 / "A가 자신의 입장을 솔직하게 작성해요"
    Step 2: 🅑 B가 입력 / "B도 따로 자신의 입장을 작성해요"  
    Step 3: 🤖 AI 분석 / "MBTI 기반으로 두 사람을 분석해요"
    Step 4: 📄 결과 확인 / "각자에게 맞는 리포트를 받아요"
  
  Each step: circle number (peach), icon, title, description

FOOTER (dark warm brown #2C1810):
  Left: 바느질 logo (white version) + tagline
  Right: 서비스 소개 / 이용약관 / 개인정보처리방침
  Bottom: "© 2025 바느질. All rights reserved."

=== SCREEN 2 — LOGIN PAGE ===

Layout: two-column, 50/50 split

LEFT PANEL (warm peach gradient background):
  Centered vertically:
    바느질 logo (large, white)
    Heading: "다시 오셨군요 🧵"
    Subtext: "우리 사이의 이야기를 이어가요"
    
    Decorative: soft illustration of two hands gently connecting
    (abstract, warm tones, not cartoonish)

RIGHT PANEL (white background, centered form, max-width 400px):
  Top: "로그인" heading (28px, bold)
  Subtext: "계정이 없으신가요? 회원가입" (link underlined, peach)
  
  Form fields (gap 16px):
    Email input:
      Label: "이메일"
      Placeholder: "이메일 주소를 입력해주세요"
      Left icon: envelope icon
    
    Password input:
      Label: "비밀번호"
      Placeholder: "비밀번호를 입력해주세요"
      Left icon: lock icon
      Right icon: eye toggle (show/hide)
  
  "비밀번호를 잊으셨나요?" link (right-aligned, small)
  
  Primary button (full width, 52px, peach):
    "로그인"
  
  Divider: ─── 또는 ───
  
  Social login buttons (full width, outlined, gap 12px):
    🟡 "카카오로 계속하기"
    ⬜ "구글로 계속하기"
  
  Bottom small text:
    "로그인하면 이용약관 및 개인정보처리방침에 동의하는 것으로 간주됩니다"

=== SCREEN 3 — SIGN UP PAGE ===

Same two-column layout as login.

LEFT PANEL (same warm peach gradient):
  바느질 logo (white)
  Heading: "처음 오셨군요 🌱"
  Subtext: "관계를 이어가는 첫 걸음을 시작해요"

RIGHT PANEL (white, max-width 400px form):
  Top: "회원가입" heading
  Subtext: "이미 계정이 있으신가요? 로그인" (link)
  
  Form fields (gap 16px):
    Name input:
      Label: "이름 또는 닉네임"
      Placeholder: "표시될 이름을 입력해주세요"
    
    Email input:
      Label: "이메일"
      Placeholder: "이메일 주소를 입력해주세요"
    
    Password input:
      Label: "비밀번호"
      Placeholder: "8자 이상 입력해주세요"
      Password strength bar below (3-segment: weak/medium/strong)
    
    Password confirm input:
      Label: "비밀번호 확인"
      Placeholder: "비밀번호를 다시 입력해주세요"
      Right: ✓ icon when matched (green)
    
    MBTI select (optional):
      Label: "나의 MBTI (선택사항)"
      Dropdown: 16 types listed
      Helper text: "나중에 설정해도 괜찮아요"
  
  Checkbox (small, peach accent):
    ☑ "이용약관 및 개인정보처리방침에 동의합니다 (필수)"
    ☐ "마케팅 수신에 동의합니다 (선택)"
  
  Primary button (full width, 52px, peach):
    "회원가입 완료"
  
  Divider: ─── 또는 ───
  
  Social signup buttons:
    🟡 "카카오로 시작하기"
    ⬜ "구글로 시작하기"

=== LAYOUT NOTES ===
- All 3 screens at 1440px × 900px (desktop)
- Place side by side in one canvas
- Consistent spacing: 8px grid system
- Input focus state: peach border + soft glow
- Button hover: slightly darker shade
- All text in Korean, no Lorem Ipsum
- Use realistic placeholder: 이메일 예시 → "hello@baneujil.kr"