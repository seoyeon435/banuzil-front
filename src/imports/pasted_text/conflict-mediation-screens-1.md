Using the same 바느질 design system, create the conflict mediation 
flow screens. Desktop web, 1440px.

=== SCREEN 1 — 중재 시작 (친구 선택) ===

Centered content (max-width 640px):

  Progress indicator (top):
    ① 친구 선택  →  ② 상황 입력  →  ③ AI 중재  →  ④ 완료
    Step 1 active (peach)

  Heading: "누구와의 갈등인가요?"
  
  Friend selector grid (2 columns):
    Each friend card (white, rounded 12px):
      Avatar (48px) + 이름 + MBTI badge
      Hover: peach border
      Selected: peach border + peach background tint + ✓ icon
    
    Show 4 friends:
      지현 / INFP  |  원규 / ISTJ
      민지 / ENFJ  |  서준 / INTP
  
  Below grid: 
    "목록에 없나요?" → "친구 추가하기" (link)

  Bottom: [다음 →] button (disabled until friend selected)

=== SCREEN 2 — 나의 입장 입력 ===

Two-panel layout:
  Left panel (420px, beige background #FFF0E8):
    Top: small avatar + "나 (박서연)" label
    
    Instructions card:
      "솔직하게 써주세요 🔒"
      "상대방은 이 내용을 그대로 볼 수 없어요"
      "AI가 중립적으로 전달해드려요"
    
    Tips accordion (collapsible):
      "이런 내용을 포함하면 좋아요"
      • 구체적인 상황 설명
      • 느낀 감정
      • 원하는 것

  Right panel (flexible, white):
    Heading: "지현에게 어떤 일이 있었나요?"
    
    Textarea (large, min-height 280px):
      Warm cream bg
      Peach focus border
      Placeholder: "상대방이 어떤 행동을 했는지,\n
                   그때 어떤 감정이 들었는지,\n
                   무엇을 원하는지 자유롭게 써주세요."
      Character counter: 0/1000
    
    Optional tags row:
      "갈등 유형:" + chip selectors
    
    Bottom action:
      [← 뒤로] ghost  +  [AI에게 전달하기 →] peach fill

=== SCREEN 3 — 상대방 입력 대기 ===

Centered (max-width 560px):

  Animated illustration:
    Two soft glowing circles orbiting slowly
    바느질 logo small in center

  Status card (white, rounded):
    ✅ 나의 입력 완료
    ⌛ 지현의 입력 대기 중
    ○  AI 분석
    ○  중재 결과

  Subtext: "지현님에게 알림이 발송되었어요"
  
  Invite reminder card (soft amber):
    "아직 입력 전이에요"
    [카카오톡으로 다시 알리기] (yellow button)
    [링크 복사하기] (ghost)

  Toggle: 입력 완료 시 알림 받기 (ON)

=== SCREEN 4 — AI 분석 중 ===

Full screen, dark warm background (#2C1810):

  Center animation:
    Large soft pulsing circle (peach glow)
    바느질 needle+thread icon animating
  
  Main text (white, 28px):
    "두 사람의 이야기를 읽고 있어요..."
  
  Progressive status messages (fade in sequence):
    "박서연님의 감정 패턴 분석 중..."
    "지현님의 입장 이해 중..."  
    "MBTI 기반 공통점 찾는 중..."
    "중립적인 전달 방식 준비 중..."
  
  Bottom: soft progress bar (peach, 0→100%)

=== SCREEN 5 — AI 중재 결과 & 멀티턴 대화 ===

IMPORTANT: This is the core mediation screen.
Three-column layout:

  LEFT COLUMN (320px, beige bg):
    Title: "중재 현황"
    
    Round status:
      "1라운드 진행중"
      Progress: 상황 공유 → 입장 전달 → 합의 도출
    
    갈등 온도 gauge:
      🌡️ 현재 온도: 62°
      Color bar: green→yellow→red, marker at 62
    
    Gottman 위험신호:
      검사됨: 비난 감지 (A측)
      Small warning chip (red outline)
    
    Participants:
      나 (박서연) ENFP + avatar
      지현 INFP + avatar
    
    [중재 종료하기] button (ghost, red text, bottom)

  CENTER COLUMN (flexible):
    Chat-style timeline (most important):
    
    AI MESSAGE 1 (full width, peach bg card):
      바느질 AI avatar (small spool icon)
      "박서연님과 지현님의 이야기를 들었어요."
      
      [박서연님에게] section:
        "솔직히 그 말 듣고 진짜 기분 나쁘지. 
         열심히 하고 있는데 그런 말 들으니까
         내가 아무것도 아닌 것 같은 느낌이었을 것 같아."
      
      [지현님에게는] section (collapsed/blurred for 박서연):
        🔒 "지현님의 메시지는 지현님께만 보여요"
    
    DIVIDER: "지현님의 입장이 전달되었어요"
    
    AI MESSAGE 2 card:
      "지현님은 이렇게 느꼈대요"
      (중립적으로 재구성된 지현의 입장)
      "지현님은 사실 여행을 가고 싶었던 게 
       도피가 아니라 재충전이 필요했던 거였어요."
    
    [나의 반응 입력] section at bottom of chat:
      Textarea (smaller, 120px):
        Placeholder: "이 내용을 듣고 어떤 생각이 드나요?"
      
      Two action buttons:
        [💬 내 입장 추가하기] (peach fill)
        [✅ 중재 완료하기] (sage green fill)

  RIGHT COLUMN (300px, white bg):
    Title: "AI 인사이트"
    
    공통점 발견 card:
      💡 "결국 둘 다 원하는 건 같아요"
      "서로에게 인정받고 싶은 마음"
    
    합의안 제안 card:
      🤝 "이런 방법은 어떨까요"
      Option chips (clickable):
        "시험 끝나고 짧은 여행 가기"
        "서로 힘들 때 바로 말하기"
    
    나의 스크립트 card:
      💬 "이렇게 말해볼 수 있어요"
      Message bubble preview
      [복사하기] button

=== SCREEN 6 — 중재 완료 & 최종 보고서 ===

Centered layout (max-width 800px):

  Top success animation:
    Large ✓ circle (sage green)
    "중재가 완료되었어요 🧵"
    Subtext: "두 사람의 이야기를 잘 들었어요"

  FINAL REPORT card (white, prominent shadow):
    Header: "최종 보고서" + 날짜
    
    Section 1 — 갈등 요약:
      갈등 유형: 가치관 차이
      총 라운드: 2라운드
      최종 갈등 온도: 38° (해소됨, green)
    
    Section 2 — 각자의 핵심 감정:
      박서연 (ENFP): "인정받지 못하는 느낌, 자존감 하락"
      지현 (INFP): "지지받고 싶은 마음, 재충전 필요"
    
    Section 3 — 합의 내용:
      ✅ "시험 끝난 후 1박 2일 짧은 여행 가기로 합의"
      ✅ "힘들 때 서로 바로 말하기로 약속"
    
    Section 4 — AI 코멘트:
      "두 분 모두 상대를 진심으로 아끼고 있었어요.
       갈등의 핵심은 표현 방식의 차이였고, 
       이번 대화를 통해 서로를 더 잘 이해하게 됐어요."

  Action buttons:
    [보고서 저장하기] (peach fill)
    [홈으로 돌아가기] (ghost)
    [친구에게 공유하기] (sage green)

=== LAYOUT NOTES ===
- All screens 1440px × 900px, side by side
- Screen 5 is the most important — spend most detail here
- Warm peach design system consistent
- All Korean, realistic dummy data (박서연 & 지현)