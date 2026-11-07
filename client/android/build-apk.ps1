# Script de compilacao automatizada de APK Android para IMPERIOS
$ErrorActionPreference = "Stop"

$SdkDir = "C:\Users\Tiago Verrone\AppData\Local\Android\Sdk"
$BuildToolsDir = "$SdkDir\build-tools\34.0.0"
$AndroidJar = "$SdkDir\platforms\android-34\android.jar"

$Aapt2 = "$BuildToolsDir\aapt2.exe"
$D8 = "$BuildToolsDir\d8.bat"
$Zipalign = "$BuildToolsDir\zipalign.exe"
$ApkSigner = "$BuildToolsDir\apksigner.bat"

$BaseDir = "c:\Users\Tiago Verrone\imperios-ascensao\client\android"
$AppDir = "$BaseDir\app\src\main"
$BuildDir = "$BaseDir\build"

Write-Host "[1/7] Limpando e preparando diretorios..."
if (Test-Path $BuildDir) { Remove-Item -Recurse -Force $BuildDir }
New-Item -ItemType Directory -Path "$BuildDir\compiled_res", "$BuildDir\gen", "$BuildDir\obj" -Force | Out-Null

Write-Host "[2/7] Compilando recursos com AAPT2..."
& $Aapt2 compile --dir "$AppDir\res" -o "$BuildDir\compiled_res.zip"

Write-Host "[3/7] Vinculando APK e gerando R.java..."
& $Aapt2 link -I $AndroidJar `
    --manifest "$AppDir\AndroidManifest.xml" `
    --java "$BuildDir\gen" `
    -A "$AppDir\assets" `
    -o "$BuildDir\unaligned_no_dex.apk" `
    "$BuildDir\compiled_res.zip"

Write-Host "[4/7] Compilando codigo Java com javac..."
$JavaFiles = Get-ChildItem -Path "$AppDir\java", "$BuildDir\gen" -Filter "*.java" -Recurse | ForEach-Object { $_.FullName }
& javac -encoding UTF-8 -cp $AndroidJar -d "$BuildDir\obj" $JavaFiles

Write-Host "[5/7] Gerando classes.dex com D8..."
$ClassFiles = Get-ChildItem -Path "$BuildDir\obj" -Filter "*.class" -Recurse | ForEach-Object { $_.FullName }
& $D8 --output "$BuildDir" --lib $AndroidJar $ClassFiles

Write-Host "[6/7] Injetando classes.dex no pacote APK..."
Copy-Item "$BuildDir\unaligned_no_dex.apk" "$BuildDir\unaligned.apk"
Push-Location $BuildDir
& jar uf "unaligned.apk" "classes.dex"
Pop-Location

Write-Host "[7/7] Zipalign e Assinatura Digital do APK..."
& $Zipalign -f -p 4 "$BuildDir\unaligned.apk" "$BuildDir\imperios-aligned.apk"

# Cria keystore de release caso nao exista
$KeyStore = "$BaseDir\imperios-release.jks"
$KeyAlias = "imperios"
$KeyPass = "imperios2026"

if (-not (Test-Path $KeyStore)) {
    & keytool -genkeypair -v `
        -keystore $KeyStore `
        -storepass $KeyPass `
        -alias $KeyAlias `
        -keypass $KeyPass `
        -keyalg RSA `
        -keysize 2048 `
        -validity 10000 `
        -dname "CN=Imperios, OU=Proton, O=Proton IA, L=Campinas, ST=SP, C=BR"
}

$FinalApk = "c:\Users\Tiago Verrone\imperios-ascensao\client\web\public\downloads\imperios.apk"
$VersionedApk = "c:\Users\Tiago Verrone\imperios-ascensao\client\web\public\downloads\imperios-v1.0.0.apk"

& $ApkSigner sign `
    --ks $KeyStore `
    --ks-pass "pass:$KeyPass" `
    --ks-key-alias $KeyAlias `
    --key-pass "pass:$KeyPass" `
    --out $FinalApk `
    "$BuildDir\imperios-aligned.apk"

Copy-Item $FinalApk $VersionedApk -Force

Write-Host "SUCESSO: APK compilado e assinado!"
Write-Host "Destino: $FinalApk"
Write-Host "Versao: $VersionedApk"
