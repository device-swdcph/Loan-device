# Dashboard ศูนย์สำรองเครื่องมือแพทย์

หน้า `index.html` ดึงข้อมูลสดจาก Google Sheet "(Dashboard) ศูนย์สำรองเครื่องมือแพทย์"
ผ่าน Google Visualization API (ไม่ต้องใช้ API key) และรีเฟรชอัตโนมัติทุก 5 นาที

## ตั้งค่าครั้งแรก
1. Google Sheet → แชร์ → การเข้าถึงทั่วไป: **ทุกคนที่มีลิงก์ – ผู้มีสิทธิ์อ่าน**
2. GitHub repo → Settings → Pages → Source: *Deploy from a branch* → เลือก branch และโฟลเดอร์ `/ (root)`
3. ได้ลิงก์ `https://device-swdcph.github.io/Loan-device/`
4. Google Sites → แทรก → **ฝัง (Embed)** → แท็บ "ตาม URL" → วางลิงก์ด้านบน → เลือก "ทั้งหน้า" แล้วปรับความสูงกรอบ

## เพิ่ม/เปลี่ยนแท็บ
แก้รายการ `SHEETS` ใน `index.html` (ชื่อแท็บ → ชื่อประเภทที่แสดง)
และ `DEPT_ALIAS` สำหรับรวมชื่อหน่วยงานที่สะกดต่างกัน
