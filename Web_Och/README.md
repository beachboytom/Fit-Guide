# Fit Guide – Tvůj osobní deník do fitka

## 1. Stručný popis účelu aplikace
**Fit Guide** je webová aplikace navržená primárně pro mobilní zařízení, která slouží jako interaktivní deník pro návštěvníky posiloven. Řeší běžný problém nepraktických papírových deníků a poznámkových bloků v telefonu. Umožňuje uživatelům rychle a přehledně zapisovat odcvičené série a váhy a zároveň slouží jako obrovská studnice inspirace díky integrované databázi cviků, kterou lze dynamicky filtrovat podle zaměřené svalové partie a obtížnosti. 

## 2. Zadání projektu (Schválený use-case)
Cílem projektu bylo vytvořit dynamickou jednostránkovou webovou aplikaci plně ovládanou jazykem JavaScript s důrazem na reálnou využitelnost v praxi (při tréninku).
* **Lokální ukládání dat:** Aplikace využívá `localStorage` pro ukládání historie tréninků přímo do zařízení uživatele (funguje částečně offline).
* **Komunikace s REST API:** Implementace bezplatného veřejného API pro získávání návodů na cvičení.
* **Responzivní design:** Kvalitní HTML5 a CSS3 kód s ohledem na mobilní zobrazení v posilovně (využití Flexboxu a Media Queries).
* **PWA (Progressive Web App):** Aplikace je připravena pro budoucí transformaci na instalovatelnou PWA.

## 3. Popis struktury projektu
Projekt je strukturován do následujících souborů a složek:
* `index.html` – Hlavní a jediná HTML šablona obsahující sémantickou strukturu webu (navigace, formuláře, kontejnery pro dynamický obsah).
* `style.css` – Hlavní kaskádové styly pro desktopovou verzi.
* `tablet.css` / `mobil.css` – Media queries pro zajištění responzivity na menších zařízeních.
* `app.js` – Hlavní mozek aplikace. Obsahuje veškerou logiku pro manipulaci s DOM, asynchronní volání API a práci s LocalStorage.
* `/media/` – Složka obsahující statické grafické podklady (pozadí, ikony, loga).

## 4. Seznam použitých API endpointů
Aplikace využívá veřejné REST API od poskytovatele **API-Ninjas** (Exercises API).
* **Základní endpoint:** `GET https://api.api-ninjas.com/v1/exercises`
* **Způsob autentizace:** API klíč zasílaný v HTTP hlavičce `X-Api-Key`.
* **Používané Query parametry:**
  * `muscle` – Filtrování podle svalové partie (např. *biceps, chest, lats*).
  * `difficulty` – Filtrování podle obtížnosti (např. *beginner, expert*).
* **Formát odpovědi:** Datové pole ve formátu `JSON` obsahující objekty s detaily jednotlivých cviků (název, typ, přesný návod).

## 5. Vysvětlení principu fungování
Aplikace je z hlediska JavaScriptu rozdělena na dva na sobě nezávislé moduly:

### A) Tréninkový deník (LocalStorage modul)
Tato část se stará o záznam výkonů. Formulář v HTML zachytí uživatelský vstup (název cviku a výkon). Po kliknutí na tlačítko se zabrání výchozímu odeslání formuláře (`e.preventDefault()`). Vstupy se spojí do JavaScriptového objektu s přiděleným unikátním ID (pomocí `Date.now()`). Objekt je metodou `unshift()` zařazen na začátek pole, pole je serializováno přes `JSON.stringify()` a zapsáno do `localStorage`. 
Pro vykreslení se pole de-serializuje (`JSON.parse()`) a v cyklu se dynamicky generují HTML elementy (`document.createElement()`). Mazání funguje na základě čtení unikátního atributu `data-id` na kliknutém tlačítku a následném vyfiltrování pole.

### B) Databáze cviků (API modul)
Uživatel vybere parametry ze `<select>` roletek. Na událost `click` tlačítka "Najít cviky" reaguje asynchronní funkce. Zkontroluje se platnost výběru a dojde k dynamickému sestavení URL adresy. Pomocí metody `fetch()` s připojenou autorizační hlavičkou se odešle dotaz na server. Kód je ošetřen blokem `try...catch` pro případ výpadku spojení. Získaná JSON data jsou následně iterována pomocí smyčky `for...of` a pro každý cvik se do předpřipraveného kontejneru v DOM vygeneruje nová informační kartička.

## 6. Use-case diagram

```mermaid
flowchart LR
    U((Uživatel)) --> Z[Zápis nového tréninku]
    U --> C[Čtení historie deníku]
    U --> M[Mazání překlepů a starých cviků]
    U --> H[Hledání inspirace z API databáze]
    H --> S[(REST API Server)]
    Z --> L[(LocalStorage)]
    C --> L
    M --> L