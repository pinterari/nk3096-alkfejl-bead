# Családi büdzsé tervező és nyilvántartó
> ELTE IK Alkalmazások fejlesztése beadandó | Pintér Arianna (NK3096)

## 1. Követelményanalízis

### 1.1 Célkitűzés
A program főbb céljai közé tartozik, hogy a felhasználók könnyen nyomon követhessék, hogy mire költenek; ellenőrzihessék gyermekeik kiadásait, valamint a családok, lakótársak, baráti társaságok megtervezhessék jövőbeli komolyabb közös kiadásaikat. Az alkalmazás ezen funkciói csak bejelentkezett felhasználóknak elérhetőek. Lehetőség van teljes jogú userként való regisztrációra, valamint csoportba történő regisztrációval is bővülhet a felhasználók tábora, legyen szó teljes vagy akár korlátozott jogkorű userről.

###### Funckionális követelmények
- Regisztráció
- Bejelentkezés
- Bejelentkezett felhasználóként elérhető funkciók:
    - Saját kiadások, bevételek menedzselése (megtekintés, hozzáadás, módosítás, törlés)
    - Saját csoportok megtekintése
    - Saját csoportok gyűjtéseinek megtekintése, hozzájárulás
    - Profiladatok megtekintése, szerkesztése
- Kizárólag teljes jogkörű userként használható funckiók:
    - Csoportok létrehozása, módosítása, törlése
    - Gyűjtés indítása, módosítása, teljesítettnek jelölése, törlése
    - Felhasználók meghívása a saját csoportokba teljes vagy korlátozott jogkörű userként
    - Csoport korlátozott jogkörű tagjainak kiadásainak megtekintése
    
###### Nem funkcionális követelmények
- **Átláthatóság**: Könnyen el lehessen igazodni az oldalon, logikus elrendezés, letisztult design
- **Védelem**: A felhasználó tényleg csak olyan oldalakat nézhessen meg és használhasson amikre valóban van jogosultsága; a jelszavak kódolt tárolása; adatok validálása mielőtt elmentenénk őket az adatbázisba
- **Bővíthetőség**: A program további funkciókkal való bővítésének, továbbfejlesztésének lehetővé tétele
