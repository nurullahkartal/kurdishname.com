# 🛠️ KurdishName: ID Temizliği ve Çakışma Denetim Raporu

Bu rapor, veritabanındaki sayısal ek alan (`_1`, `_2` vb.) isimleri temizleme, mükerrerleri silme ve 301 yönlendirmelerini oluşturma operasyonunun sonuçlarını içerir.

## 📊 Operasyon Sonuçları

- **Toplam Düzeltilen (Yeniden Adlandırılan - Senaryo A) İsim Sayısı:** 148
- **Toplam Silinen (Mükerrer Kopya - Senaryo B) İsim Sayısı:** 7
- **Yönlendirme Sayısı (Tüm dillerde):** 620 (Her isim için 4 dil)
- **Tespit Edilen Çakışma Sayısı:** 1

## 🟢 Yeniden Adlandırılan İsimler (Senaryo A)
Temiz hali veritabanında bulunmadığı için doğrudan temiz ID'ye aktarılan isimler:

| Eski ID | Yeni ID | İsim |
| :--- | :--- | :--- |
| `bezo` | `bezo` | **Bêzo** |
| `binav` | `binav` | **Binav** |
| `brusk` | `brusk` | **Brûsk** |
| `behdin` | `behdin` | **Behdîn** |
| `delal` | `delal` | **Delal** |
| `havin` | `havin` | **Havîn** |
| `hewraz` | `hewraz` | **Hewraz** |
| `kem` | `kem` | **Kem** |
| `memlan` | `memlan` | **Memlan** |
| `mira` | `mira` | **Mira** |
| `nisan` | `nisan` | **Nisan** |
| `nuroj` | `nuroj` | **Nûroj** |
| `piroz` | `piroz` | **Pîroz** |
| `rewan` | `rewan` | **Rêwan** |
| `rezo` | `rezo` | **Rezo** |
| `rihan` | `rihan` | **Rîhan** |
| `robar` | `robar` | **Robar** |
| `robin` | `robin` | **Robîn** |
| `roda` | `roda` | **Roda** |
| `roj` | `roj` | **Roj** |
| `rojan` | `rojan` | **Rojan** |
| `rojat` | `rojat` | **Rojat** |
| `rojbin` | `rojbin` | **Rojbîn** |
| `rojdar` | `rojdar` | **Rojdar** |
| `rojder` | `rojder` | **Rojder** |
| `roje` | `roje` | **Rojê** |
| `rojen` | `rojen` | **Rojen** |
| `rojgar` | `rojgar` | **Rojgar** |
| `rojgul` | `rojgul` | **Rojgul** |
| `rojhelat` | `rojhelat` | **Rojhelat** |
| `rojin` | `rojin` | **Rojîn** |
| `rojko` | `rojko` | **Rojko** |
| `rojma` | `rojma` | **Rojma** |
| `rojna` | `rojna` | **Rojna** |
| `rojwan` | `rojwan` | **Rojwan** |
| `rojyar` | `rojyar` | **Rojyar** |
| `rokar` | `rokar` | **Rokar** |
| `roleda` | `roleda` | **Rolêda** |
| `rolez` | `rolez` | **Rolez** |
| `rona` | `rona` | **Rona** |
| `ronahi` | `ronahi` | **Ronahî** |
| `ronak` | `ronak` | **Ronak** |
| `ronas` | `ronas` | **Ronas** |
| `ronav` | `ronav` | **Ronav** |
| `rondik` | `rondik` | **Rondik** |
| `roni` | `roni` | **Ronî** |
| `ronida` | `ronida` | **Ronîda** |
| `ronya` | `ronya` | **Ronya** |
| `rosin` | `rosin` | **Roşîn** |
| `rosna` | `rosna` | **Roşna** |
| `roz` | `roz` | **Roz** |
| `roza` | `roza` | **Roza** |
| `roze` | `roze` | **Rozê** |
| `rozelin` | `rozelin` | **Rozelîn** |
| `rozerin` | `rozerin` | **Rozerîn** |
| `rubar` | `rubar` | **Rûbar** |
| `ruha` | `ruha` | **Ruha** |
| `ruken` | `ruken` | **Rûken** |
| `runa` | `runa` | **Rûna** |
| `runak` | `runak` | **Rûnak** |
| `rundik` | `rundik` | **Rûndik** |
| `runi` | `runi` | **Rûnî** |
| `ruse` | `ruse` | **Ruşe** |
| `rusen` | `rusen` | **Rûşen** |
| `ruxsar` | `ruxsar` | **Ruxsar** |
| `sakar` | `sakar` | **Sakar** |
| `sako` | `sako` | **Sako** |
| `samal` | `samal` | **Samal** |
| `samrend` | `samrend` | **Samrend** |
| `saro` | `saro` | **Saro** |
| `saz` | `saz` | **Saz** |
| `sazan` | `sazan` | **Sazan** |
| `sengaw` | `sengaw` | **Sengaw** |
| `serdar` | `serdar` | **Serdar** |
| `seyran` | `seyran` | **Seyran** |
| `simko` | `simko` | **Simko** |
| `sirwan` | `sirwan` | **Sîrwan** |
| `sirwe` | `sirwe` | **Sirwe** |
| `situn` | `situn` | **Sitûn** |
| `siwar` | `siwar` | **Siwar** |
| `skala` | `skala` | **Skala** |
| `sokar` | `sokar` | **Sokar** |
| `soran` | `soran` | **Soran** |
| `sozan` | `sozan` | **Sozan** |
| `srust` | `srust` | **Srûşt** |
| `stran` | `stran` | **Stran** |
| `saho` | `saho` | **Şaho** |
| `sehrivan` | `sehrivan` | **Şehrivan** |
| `semal` | `semal` | **Şemal** |
| `semam` | `semam` | **Şemam** |
| `semzin` | `semzin` | **Şemzîn** |
| `sepol` | `sepol` | **Şepol** |
| `ser` | `ser` | **Şêr** |
| `sere` | `sere` | **Şêrê** |
| `sergel` | `sergel` | **Şêrgel** |
| `serhat` | `serhat` | **Şêrhat** |
| `serin` | `serin` | **Şêrîn** |
| `serko` | `serko` | **Şêrko** |
| `sermin` | `sermin` | **Şermîn** |
| `sero` | `sero` | **Şêro** |
| `serwan` | `serwan` | **Şêrwan** |
| `serzad` | `serzad` | **Şêrzad** |
| `silan` | `silan` | **Şîlan** |
| `sino` | `sino` | **Şîno** |
| `sivan` | `sivan` | **Şivan** |
| `siyar` | `siyar` | **Şiyar** |
| `sores` | `sores` | **Şoreş** |
| `soxan` | `soxan` | **Şoxan** |
| `tanya` | `tanya` | **Tanya** |
| `tara` | `tara` | **Tara** |
| `telar` | `telar` | **Telar** |
| `tirej` | `tirej` | **Tîrêj** |
| `tiroj` | `tiroj` | **Tîroj** |
| `tolhildan` | `tolhildan` | **Tolhildan** |
| `trife` | `trife` | **Trîfe** |
| `vejin` | `vejin` | **Vejîn** |
| `vinda` | `vinda` | **Vînda** |
| `viyan` | `viyan` | **Viyan** |
| `wala` | `wala` | **WALA** |
| `wane` | `wane` | **Wane** |
| `wirya` | `wirya` | **Wirya** |
| `xebat` | `xebat` | **Xebat** |
| `xezal` | `xezal` | **Xezal** |
| `xezem` | `xezem` | **Xezêm** |
| `xonas` | `xonas` | **Xonas** |
| `xonaw` | `xonaw` | **Xonaw** |
| `xozge` | `xozge` | **Xozge** |
| `xwededa` | `xwededa` | **Xwedêda** |
| `yadigar` | `yadigar` | **Yadîgar** |
| `yara` | `yara` | **Yara** |
| `yarin` | `yarin` | **Yarîn** |
| `yezda` | `yezda` | **Yezda** |
| `zagros` | `zagros` | **Zagros** |
| `zal` | `zal` | **Zal** |
| `zalin` | `zalin` | **Zalîn** |
| `zana` | `zana` | **Zana** |
| `zanyar` | `zanyar` | **Zanyar** |
| `zayele` | `zayele` | **Zayele** |
| `zaza` | `zaza` | **Zaza** |
| `zebar` | `zebar` | **Zêbar** |
| `zerdest` | `zerdest` | **Zerdeşt** |
| `zimnako` | `zimnako` | **Zimnako** |
| `zinar` | `zinar` | **Zinar** |
| `ziryan` | `ziryan` | **Ziryan** |
| `zorab` | `zorab` | **Zorab** |
| `zoran` | `zoran` | **Zoran** |
| `zozan` | `zozan` | **Zozan** |
| `sin` | `sin` | **Şîn** |

## 🟢 Silinen Mükerrer İsimler (Senaryo B)
Temiz hali zaten veritabanında olan ve anlam/cinsiyet yönünden birebir aynı olduğu için silinen kayıtlar:

| Silinen ID | İsim | Cinsiyet |
| :--- | :--- | :--- |
| `cemil_2` | **Cemîl** | `male` |
| `hesin_2` | **Hêşîn** | `female` |
| `rinde_2` | **Rindê** | `female` |
| `rojda_2` | **Rojda** | `female` |
| `rojhat_2` | **Rojhat** | `male` |
| `sine_2` | **Şine** | `female` |
| `zin_2` | **Zîn** | `female` |

## 🔴 Çakışma Raporu (Müdahale Edilmeyenler)
Temiz hali veritabanında olan ancak cinsiyet veya anlam yönünden farklı olduğu için dokunulmayan kayıtlar:

| Varyasyon ID | Ana ID | İsim | Varyasyon Cinsiyet | Ana Cinsiyet | Çakışma Sebebi |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `bese_2` | `bese` | **Besê** | `female` | `male` | **Cinsiyet farklı (Varyasyon: female, Ana: male)** |
