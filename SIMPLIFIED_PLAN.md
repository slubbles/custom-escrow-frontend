# 🎯 ## 🎯 **Core Concept**

**Purpose:** Multi-project token presale platform with vesting schedules - any project can launch tiered token sales with community building tools.

**Key Features:**
- **Multi-tenant:** Any project can use the platform
- **Tiered sales:** Seed → Private → Public with different prices
- **Vesting system:** Account balance tracking with linear vesting
- **Community tools:** Whitelist, referrals, social sharing
- **Proof system:** Simple account balance (not instant settlement)ified Token Presale Platform
## Vision: Vesting-Based Token Sales for Unlisted Tokens

---

## 📋 **Core Concept**

**Purpose:** Enable presales of unlisted tokens with vesting schedules - investors buy now, receive tokens over time with proof of ownership.

**Key Difference from ICO:** Not instant settlement - investors get **vesting contracts** that release tokens over time.

---

## 🔄 **User Flow**

### **Seller Journey:**
```
1. Create Token Sale
   ├─ Set token details (SNRB, 1M tokens)
   ├─ Set price (0.001 SOL per token)
   ├─ Configure vesting (6 months linear)
   └─ Deposit tokens into vesting contract

2. Share Sale
   ├─ Get shareable link
   ├─ Market via social media/community
   └─ Track sales progress

3. Manage Vesting
   ├─ Monitor vesting releases
   ├─ Handle investor queries
   └─ Collect proceeds
```

### **Buyer Journey:**
```
1. Discover Sale
   ├─ Find via link/social media
   ├─ Browse public sales list
   └─ Research project

2. Purchase Tokens
   ├─ Connect wallet
   ├─ Choose amount (with limits)
   ├─ Pay SOL
   └─ Receive vesting contract/proof

3. Track Vesting
   ├─ Check vesting progress
   ├─ Claim available tokens
   └─ Monitor portfolio value
```

---

## 🏗️ **Technical Architecture**

### **Smart Contract Components:**
1. **Sale Creation Contract**
   - Create presale with vesting parameters
   - Accept SOL payments
   - Issue vesting contracts to buyers

2. **Vesting Contract**
   - Store buyer's token allocation
   - Calculate claimable tokens over time
   - Handle token claims/releases

3. **Proof System**
   - NFT receipts OR account balances
   - Show vesting schedule and progress
   - Enable portfolio tracking

### **Frontend Pages:**
```
├── / (Landing)
│   ├─ Platform overview
│   ├─ Featured projects
│   ├─ Create project CTA
│   └─ Success stories
│
├── /projects
│   ├─ Browse all projects
│   ├─ Filter by status/category
│   └─ Search functionality
│
├── /project/[slug]
│   ├─ Project overview
│   ├─ Team information
│   ├─ Active/upcoming sales
│   └─ Community links
│
├── /project/[slug]/sale/[tier]
│   ├─ Sale details (seed/private/public)
│   ├─ Purchase interface
│   ├─ Vesting schedule display
│   ├─ Referral tracking
│   └─ Social sharing
│
├── /create-project
│   ├─ Project registration
│   ├─ Token configuration
│   ├─ Sale tier setup
│   └─ Launch dashboard
│
└── /portfolio
    ├─ Vesting contracts across projects
    ├─ Claimable tokens
    ├─ Referral earnings
    └─ Claim interface
```

---

## 🎯 **Core Features**

### **Phase 1: MVP (2-3 weeks)**
- [ ] **Basic Sale Creation**
  - Token selection and deposit
  - Price and vesting configuration
  - Simple linear vesting only

- [ ] **Purchase Flow**
  - SOL payment processing
  - Vesting contract creation
  - Basic proof of purchase

- [ ] **Portfolio Tracking**
  - View vesting contracts
  - Simple claim interface
  - Basic progress tracking

- [ ] **Public Discovery**
  - Simple sales listing page
  - Basic sale information display
  - Direct sale links

### **Phase 2: Enhanced Features (1-2 weeks)**
- [ ] **Advanced Vesting**
  - Cliff periods
  - Multiple vesting schedules
  - Milestone-based releases

- [ ] **Better Proof System**
  - NFT receipts
  - Transferable vesting rights
  - Enhanced portfolio UI

- [ ] **Marketing Tools**
  - Social sharing integration
  - Referral tracking
  - Sale analytics

### **Phase 3: Polish (1 week)**
- [ ] **Mobile Optimization**
- [ ] **Security Hardening**
- [ ] **Performance Optimization**
- [ ] **Error Handling**

---

## 💰 **Vesting Mechanisms**

### **Vesting Types to Support:**
1. **Linear Vesting**
   ```
   Example: 1000 tokens over 10 months = 100 tokens/month
   Month 1: 100 tokens claimable
   Month 2: 200 tokens claimable (cumulative)
   Month 10: 1000 tokens claimable
   ```

2. **Cliff Vesting**
   ```
   Example: 6-month cliff, then linear
   Months 1-6: 0 tokens claimable
   Month 7: 700 tokens claimable (6 months backlog + current)
   Month 8: 800 tokens claimable
   ```

3. **Milestone Vesting** (Future)
   ```
   Example: Release based on project milestones
   Beta Launch: 25% released
   Mainnet: 50% released
   Partnership: 25% released
   ```

### **Proof of Ownership:**
**Option A: Account Balance System**
- Simple: Check website to see vesting progress
- Centralized but easy to implement

**Option B: NFT Receipts**
- Decentralized: NFT represents vesting contract
- More complex but fully on-chain

**Recommendation:** Start with Option A, upgrade to Option B later

---

## 🚀 **Token Sale Success Strategy**

### **Community-First Approach:**
1. **Pre-Sale Community Building (8-12 weeks)**
   ```
   Week 1-4: Content & Education
   ├─ Launch social channels (Twitter, Discord, Telegram)
   ├─ Share project vision, team, roadmap
   ├─ Educational content about problem/solution
   └─ Build initial 500-1000 engaged followers

   Week 5-8: Engagement & Partnerships
   ├─ Twitter Spaces, AMAs, podcast appearances
   ├─ Cross-promotion with other projects
   ├─ Influencer relationships and collaborations
   └─ Grow to 2000-5000 quality followers

   Week 9-12: Whitelist & Hype Building
   ├─ Launch whitelist campaign with tasks
   ├─ Exclusive perks for early supporters
   ├─ Limited whitelist spots create urgency
   └─ Target: 5000-10000+ whitelist signups
   ```

2. **Tiered Sale Structure (High Conversion)**
   ```
   🔥 Seed Sale (Ultra Exclusive)
   ├─ Price: 0.0005 SOL per token (50% discount)
   ├─ Limit: 500 tokens per wallet max
   ├─ Access: Top 100 whitelist members only
   ├─ Vesting: 6 months linear
   └─ Creates extreme FOMO and exclusivity

   💎 Private Sale (Whitelist Rewards)
   ├─ Price: 0.0008 SOL per token (20% discount)
   ├─ Limit: 1000 tokens per wallet max
   ├─ Access: Whitelist members (500 spots)
   ├─ Vesting: 4 months linear
   └─ Rewards early community supporters

   🚀 Public Sale (FOMO Peak)
   ├─ Price: 0.001 SOL per token (full price)
   ├─ Limit: 2000 tokens per wallet max
   ├─ Access: Open to everyone
   ├─ Vesting: 3 months linear
   └─ Capitalizes on previous sales success
   ```

3. **Viral Referral System**
   ```
   Referral Rewards:
   ├─ 1 successful referral → 5% bonus tokens
   ├─ 5 successful referrals → 10% bonus tokens
   ├─ 10 successful referrals → 20% bonus tokens
   ├─ Top monthly referrer → 50% bonus + exclusive NFT
   └─ Automatic viral growth through incentives
   ```

4. **FOMO & Social Proof Tactics**
   ```
   Psychological Triggers:
   ├─ ⏰ Time scarcity: "Seed sale ends in 48 hours"
   ├─ 👥 Supply scarcity: "Only 23 seed spots remaining"
   ├─ 📈 Price progression: "Private sale price increases tomorrow"
   ├─ 🎉 Social proof: "John just bought 500 tokens!"
   ├─ 📊 Live counters: Real-time purchase activity
   └─ 🏆 Exclusive access: "Whitelist members only"
   ```

---

## 🏗️ **Multi-Project Platform Features**

### **Project Onboarding System:**
```
1. Register Project
   ├─ Project name, logo, description, category
   ├─ Token contract address validation
   ├─ Team information and social links
   ├─ Roadmap and whitepaper upload
   └─ Custom project slug (yourproject.tokenlaunch.com)

2. Configure Sale Tiers
   ├─ Seed sale (price, supply, limits, vesting)
   ├─ Private sale settings and whitelist size
   ├─ Public sale parameters and timing
   ├─ Referral bonus structure
   └─ Custom branding and messaging

3. Community Management Tools
   ├─ Whitelist management dashboard
   ├─ Referral tracking and leaderboards
   ├─ Automated email/discord notifications
   ├─ Social media integration and sharing
   └─ Analytics and conversion tracking

4. Launch & Monitor
   ├─ Sales performance dashboard
   ├─ Real-time purchase notifications
   ├─ Community engagement metrics
   ├─ Revenue and token distribution tracking
   └─ Investor communication tools
```

### **Platform Revenue Model:**
```
Platform Fees (Per Project):
├─ 2.5% fee on all token sales
├─ One-time project setup fee: 0.5 SOL
├─ Premium features (custom domain): 2 SOL/month
├─ Enhanced analytics package: 1 SOL/month
└─ White-label solution: 10 SOL/month
```

---
- [ ] Public sales listing page
- [ ] Featured/trending sales
- [ ] Search and filter functionality
- [ ] Sale countdown timers

### **External Marketing Tools:**
- [ ] **Social Sharing:** Auto-generated sale cards for Twitter
- [ ] **Referral System:** Bonus tokens for bringing friends
- [ ] **Whitelist System:** Early access for community members
- [ ] **Email Integration:** Updates for sale participants

### **Community Building:**
- [ ] **Discord/Telegram Integration:** Sale announcements
- [ ] **Twitter Spaces:** Live sale discussions
- [ ] **Influencer Dashboard:** Track referral performance
- [ ] **Press Kit:** Logos, descriptions, sale graphics

---

## 🔧 **Implementation Priorities**

### **Week 1: Core Vesting Logic**
- [ ] Smart contract: Basic vesting functionality
- [ ] Frontend: Sale creation page
- [ ] Testing: Vesting calculations and claims

### **Week 2: Purchase & Portfolio**
- [ ] Purchase flow implementation
- [ ] Portfolio/vesting tracking page
- [ ] Basic error handling

### **Week 3: Public Discovery**
- [ ] Sales listing page
- [ ] Sale detail pages
- [ ] Search and filtering

### **Week 4: Polish & Launch**
- [ ] Mobile optimization
- [ ] Security review
- [ ] Marketing tools integration
- [ ] Beta testing with real sales

---

## 🤔 **Open Questions**

### **Vesting Implementation:**
1. **What's the standard vesting period?** (6 months, 1 year, custom?)
2. **Cliff periods needed?** (e.g., nothing for 3 months, then start vesting)
3. **Vesting frequency?** (Daily, weekly, monthly claims?)

### **Proof System:**
1. **NFT receipts or simple account tracking?**
2. **Should vesting contracts be transferable?**
3. **What metadata to include in proofs?**

### **Sale Structure:**
1. **Multiple rounds per project?** (Seed → Private → Public)
2. **Different pricing tiers?**
3. **Purchase limits per wallet/person?**

### **Discovery & Marketing:**
1. **Whitelist/early access system needed?**
2. **Referral bonuses structure?**
3. **Integration with existing communities?**

---

## 🎯 **Success Metrics**

### **Technical:**
- [ ] Vesting contracts work correctly
- [ ] Claims process is smooth
- [ ] Zero lost tokens/funds

### **Business:**
- [ ] Sales creation is easy
- [ ] Buyers understand vesting clearly
- [ ] Good conversion from visitors to buyers

### **User Experience:**
- [ ] Mobile-friendly purchase flow
- [ ] Clear vesting progress display
- [ ] Helpful error messages

---

## 📝 **Next Steps**

1. **Clarify vesting requirements** (linear vs cliff, periods, etc.)
2. **Choose proof system** (NFT vs account tracking)
3. **Start with sale creation page** (replace current redirect)
4. **Implement basic vesting contract** 
5. **Build portfolio tracking**

**Target:** Working MVP in 3 weeks, ready for first real token sale.