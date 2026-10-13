param([string]$PythonWindowless)
$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$desktopDirectory = [Environment]::GetFolderPath('Desktop')
if (!$PythonWindowless) {
    $pythonCommand = Get-Command pythonw.exe -ErrorAction SilentlyContinue
    if ($pythonCommand) { $PythonWindowless = $pythonCommand.Source }
    else { $PythonWindowless = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\python\pythonw.exe' }
}
$pythonWindowless = $PythonWindowless
$launcherPath = Join-Path $projectRoot 'tools\launch-local.py'
if (!(Test-Path -LiteralPath $pythonWindowless) -or !(Test-Path -LiteralPath $launcherPath)) {
    throw 'Le programme de lancement ou Python est introuvable.'
}
$shortcutShell = New-Object -ComObject WScript.Shell
$shortcuts = @(
    @{ Name = 'Portfolio - Ryad'; Page = 'portfolio'; Icon = 14; Description = 'Ouvrir le portfolio et démarrer son serveur local si nécessaire.' },
    @{ Name = 'Design System - Ryad'; Page = 'design-system'; Icon = 22; Description = 'Ouvrir le design system Toon / Slime avec les réglages validés.' }
)
foreach ($entry in $shortcuts) {
    $shortcutPath = Join-Path $desktopDirectory ($entry.Name + '.lnk')
    $shortcut = $shortcutShell.CreateShortcut($shortcutPath)
    $shortcut.TargetPath = $pythonWindowless
    $shortcut.Arguments = '"' + $launcherPath + '" ' + $entry.Page
    $shortcut.WorkingDirectory = $projectRoot
    $shortcut.Description = $entry.Description
    $shortcut.IconLocation = (Join-Path $env:SystemRoot 'System32\shell32.dll') + ',' + $entry.Icon
    $shortcut.WindowStyle = 7
    $shortcut.Save()
    $verified = $shortcutShell.CreateShortcut($shortcutPath)
    if ($verified.TargetPath -ne $pythonWindowless -or $verified.Arguments -ne $shortcut.Arguments) {
        throw "Raccourci incorrect : $shortcutPath"
    }
    [PSCustomObject]@{ Raccourci = $shortcutPath; Cible = $verified.TargetPath; Arguments = $verified.Arguments }
}
