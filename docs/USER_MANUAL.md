# ⚡ Zealand Labs — Hurtig Brugervejledning (Bite-Sized Guide)

> **Velkommen til Zealand Labs!** Ingen lange kedelige manualer her. Kun det du skal bruge i **3 enkle trin**, uanset hvem du er. 🚀

---

## 🎒 1. For Studerende — Lån Udstyr & Byg Dit Projekt

Vil du lave fede videoer, podcasts, 3D-printe eller trykke dit eget merch? Sådan gør du:

```
[ 1. Find dit gear ] ──▶ [ 2. Scan ved skranken ] ──▶ [ 3. Skab & Aflever ]
```

### Trin 1: Find hvad du mangler 🔍
- Tjek det åbne katalog på `labs.zealand.dk/catalogue`.
- Find trin-for-trin guides til prototyper under `Projekter` (fx T-shirts, kopper, klistermærker eller 3D-print).

### Trin 2: Hent det i Makerspace eller MediaLab 📦
- Gå hen til lab-skranken i åbningstiden.
- Vis dit **Studiekort** eller oplys dit **Student ID** (fx `mfe12345`).
- Lab-vagten bipper dit kort og udstyrets stregkode med scanneren — bum, så er det dit!

### Trin 3: Pas på grejet & aflever til tiden ⏱️
- Brug udstyret på campus eller hjemme efter aftale.
- **Aflevering:** Tag det med tilbage til skranken, hvor vagten bipper det retur. 
- *Pro tip:* Sørg for at kabler, batterier og SD-kort følger med i kassen, så næste studerende også kan bruge det!

---

## 🎓 2. For Undervisere — Book Kits & Planlæg Forløb

Skal din klasse optage interviews, bygge prototyper eller køre en design-sprint?

```
[ 1. Find SOP & Gear ] ──▶ [ 2. Aftal Klassesæt ] ──▶ [ 3. Slip Eleverne Løs ]
```

### Trin 1: Få overblik over maskiner & manuals 📋
- Gå til `Manualer & Sikkerhed` for at hente godkendte PDF-sikkerhedsinstrukser (SOPs) til 3D-printere, laserskærere og fotoudstyr.
- Del vejledningerne direkte på Teams eller Moodle før værkstedsdagen.

### Trin 2: Benyt færdige pakkesæt (Bundles) 🎒
- Labs har foruddefinerede pakkesæt (fx *Podcast Kit* med mikrofoner + stativer, eller *Videokit* med kamera, lys og SD-kort).
- Tag fat i den lab-ansvarlige før modulet, så sættene er klargjorte og opladte til dine studerende.

### Trin 3: Projektaflevering i værkstedet 💡
- Send de studerende direkte ind i Makerspace med deres vektorfiler (.svg/.dxf) eller 3D-modeller (.stl/.step).
- Laboranterne hjælper med den tekniske betjening af maskinerne.

---

## 🛠️ 3. For Lab-Vagter & Operatører — POS & Daglig Drift

Sidder du ved skranken? Her er dit lynkursus i betjening af **Zealand Labs POS Dashboard**:

```
[ 1. Scan Studerende ] ──▶ [ 2. Bip Udstyr ] ──▶ [ 3. Bekræft Lån ]
```

### Trin 1: Start en session 👤
- Sørg for at markøren står i søgefeltet øverst (eller brug scanneren direkte).
- **Bip studiekortet:** Systemet genkender automatisk studerende i `AUTO`-mode.
- *Første gang?* Hvis den studerende er ny, popper en dialog op — bekræft e-mailen på 2 sekunder.

### Trin 2: Bip udstyrets stregkode 🏷️
- Ret håndscanneren mod stregkoden på kameraet, værktøjet eller kassen.
- **Pakkesæt (Bundles):** Hvis udstyret har tilknyttet tilbehør (batteri, oplader, taske), spørger systemet om du vil inkludere det i kurven. Vælg med ét klik!
- Vælg lånets varighed (fx *I dag*, *3 dage* eller *1 uge*).

### Trin 3: Aflevering & Retur 🔄
- **Hurtig retur:** Når en studerende kommer med en kasse, bipper du blot udstyrets stregkode. Den tjekkes automatisk af i returneringslisten.
- **Defekt udstyr:** Klik på *Flag Skade* hvis en skærm er flækket eller et kabel knækket. Udstyret skifter automatisk status til `MAINTENANCE` og ryger ud af cirkulation.

---

## ❓ FAQ & Fejlfinding på 10 Sekunder

| Problem | Hurtigt Fix |
| :--- | :--- |
| **Scanneren reagerer ikke?** | Tjek at scannerens USB-kabel sidder i, og at det grønne/blå statuspunkt lyser i søgefeltet. Tryk hvor som helst i feltet for at fokusere. |
| **Studerende findes ikke i systemet?** | Tryk på `STUDENT`-knappen, tast ID'et (fx `mfe999`), og tilknyt deres `@edu.zealand.dk` mail i pop-up vinduet. |
| **Udstyr mangler label/stregkode?** | Gå til `Lager/Udstyr` i admin, find genstanden, og klik *Udskriv label* (Code 128 stregkode genereres lokalt). |
| **Glemt admin kodeord?** | Kør `npm run setup:admin` direkte i terminalen på serveren for at nulstille eller oprette en ny superadmin. |
