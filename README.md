# Családi büdzsé tervező és nyilvántartó
> ELTE IK Alkalmazások fejlesztése beadandó | Pintér Arianna (NK3096)

## 1. Követelményanalízis

### 1.1 Célkitűzés
A program főbb céljai közé tartozik, hogy a felhasználók könnyen nyomon követhessék, hogy mire költenek; ellenőrzihessék gyermekeik kiadásait, valamint a családok, lakótársak, baráti társaságok megtervezhessék jövőbeli komolyabb közös kiadásaikat. Az alkalmazás ezen funkciói csak bejelentkezett felhasználóknak elérhetőek. Lehetőség van teljes jogú userként való regisztrációra, valamint csoportba történő regisztrációval is bővülhet a felhasználók tábora, legyen szó teljes vagy akár korlátozott jogkorű userről.

###### Funckionális követelmények
- Regisztráció
- Bejelentkezés
- Bejelentkezett felhasználóként elérhető funkciók:
    - Saját kiadások, bevételek menedzselése (megtekintés, hozzáadás, törlés)
    - Saját csoportok megtekintése
    - Saját csoportok gyűjtéseinek megtekintése, hozzájárulás
    - Profiladatok megtekintése, szerkesztése
    - Csoportok létrehozása, kilépés a csoportból
- Kizárólag teljes jogkörű userként használható funckiók:
    - Gyűjtés indítása
    - Felhasználók meghívása a saját csoportokba teljes vagy korlátozott jogkörű userként
    - Csoport korlátozott jogkörű tagjainak kiadásainak megtekintése
    
###### Nem funkcionális követelmények
- **Átláthatóság**: Könnyen el lehessen igazodni az oldalon, logikus elrendezés, letisztult design
- **Bővíthetőség**: A program további funkciókkal való bővítésének, továbbfejlesztésének lehetővé tétele
- **Védelem**: A felhasználó tényleg csak olyan oldalakat nézhessen meg és használhasson amikre valóban van jogosultsága; a jelszavak kódolt tárolása; adatok validálása mielőtt elmentenénk őket az adatbázisba

### 1.2 Használati-eset modell

###### Felhasználói szerepkörök
- **Vendég**: Nem bejelentkezett felhasználó; számára csak a publikus oldalak érhetőek el: a bejelentkezés, a regisztráció és az oldal tematikáját leíró főoldal
- **Teljes jogkörű felhasználó**, *"Nagykorú"*: Létrehozhat csoportokat, gyűjtéseket és kezelheti őket; meghívhat felhasználókat a csoportjaiba; a csoportjaiban szereplő kiskorúak kiadásait is megnézheti
- **Korlátozott jogkörű felhasználó**, *"Kiskorú"*: Saját kiadásait, bevételeit kezelheti, de a csoportba nem hívhat meg tagokat, nem hozhat létre gyűjtéseket.

###### Use Case Diagram
![Use Case Diagram](docs/images/usecase.png)

###### Példafolyamat - Kiadás hozzáadása
1. Bejelentkezés
2. Ezután a felhasználó egyből a kiadásait listázó oldalra kerül, ahol lehetősége van új kiadást felvenni; az új tétel hozzáadása gombra nyomva lehet a felülethez jutni
3. Kiadás részletezése:
  - Összeg meghatározása
  - Dátum kiválasztása
  - Kategória kiválasztása
  - Opcionális esetben komment írása
4. A hozzáadás gombra kattintva a kiadás hozzáadódik a felhasználó tételeihez, majd a felhasználót átirányítjuk a tételeket listázó oldalra
