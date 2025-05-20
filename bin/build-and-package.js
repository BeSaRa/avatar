const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const readline = require('readline-sync')

const angularConfigPath = path.join(__dirname, '..', 'angular.json')
if (!fs.existsSync(angularConfigPath)) {
  console.error('❌ angular.json file not found!')
  process.exit(1)
}

const angularConfig = JSON.parse(fs.readFileSync(angularConfigPath, 'utf8'))
const projects = Object.keys(angularConfig.projects)

if (projects.length === 0) {
  console.error('❌ No projects found in angular.json!')
  process.exit(1)
}

let selectedProject
if (projects.length === 1) {
  selectedProject = projects[0]
} else {
  console.log('\nAvailable Angular projects:')
  projects.forEach((proj, index) => console.log(`${index + 1}) ${proj}`))
  const projChoice = readline.question('Select a project (number): ').trim()
  const projIndex = parseInt(projChoice, 10) - 1
  if (projIndex < 0 || projIndex >= projects.length) {
    console.error('❌ Invalid selection! Please restart the script.')
    process.exit(1)
  }
  selectedProject = projects[projIndex]
}

const outputPath = angularConfig.projects[selectedProject].architect.build.options.outputPath
if (!outputPath) {
  console.error(`❌ Could not find outputPath for project: ${selectedProject}`)
  process.exit(1)
}
console.log(`📁 Using outputPath from angular.json: ${outputPath}`)

const envFilePath = path.join(__dirname, '..', 'src', 'resources', 'environment.json')
if (!fs.existsSync(envFilePath)) {
  console.error('❌ environment.json file not found at:', envFilePath)
  process.exit(1)
}

const envData = JSON.parse(fs.readFileSync(envFilePath, 'utf8'))
const envKeys = Object.keys(envData.ENVIRONMENTS_URLS)
if (envKeys.length === 0) {
  console.error('❌ No environments found in ENVIRONMENTS_URLS!')
  process.exit(1)
}

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'))
const version = packageJson.version

function getLastFolderName(outputPath) {
  const normalizedPath = path.normalize(outputPath)
  return path.basename(normalizedPath)
}

function isOcp(selectedEnv) {
  const question = `Should the environment "${selectedEnv}" use OCP? (y/n): `
  while (true) {
    const input = readline.question(question).trim().toLowerCase()
    if (input === 'y' || input === 'yes') {
      envData.IS_OCP = true
      console.log('✅ OCP mode enabled.')
      break
    } else if (input === 'n' || input === 'no') {
      envData.IS_OCP = false
      console.log('ℹ️ OCP mode disabled.')
      break
    } else {
      console.log('❌ Invalid input. Please enter "y" or "n".')
    }
  }
}

function updateEnvironment(selectedEnv) {
  console.log(`🔄 Updating BASE_ENVIRONMENT to: ${selectedEnv}`)
  envData.BASE_ENVIRONMENT = selectedEnv
  fs.writeFileSync(envFilePath, JSON.stringify(envData, null, 4))
}

function buildProjectWithBaseHref(baseHref) {
  const baseArg = baseHref ? ` --base-href=${baseHref}` : ''
  console.log(`🚀 Building Angular Project in production mode${baseHref ? ` with base href '${baseHref}'` : ''}...`)
  execSync(`ng build --configuration=production${baseArg}`, { stdio: 'inherit' })
}

function buildAndCompress(selectedEnv, baseHref) {
  buildProjectWithBaseHref(baseHref)

  const distFolderPath = path.join(__dirname, '..', outputPath)

  if (!fs.existsSync(distFolderPath)) {
    console.error(`❌ Error: The folder "${distFolderPath}" does not exist.`)
    process.exit(1)
  }

  const archiveName = `dist_${version}.rar`
  const targetFolder = path.join(__dirname, '..', 'dist', selectedEnv)

  console.log(`📦 Compressing folder: ${distFolderPath}`)
  const isWindows = process.platform === 'win32'
  const rarCommand = isWindows
    ? `"C:\\Program Files\\WinRAR\\rar.exe" a -ep1 ${archiveName} ${distFolderPath}`
    : `rar a -ep1 ${archiveName} ${distFolderPath}`

  execSync(rarCommand, { cwd: path.dirname(distFolderPath), stdio: 'inherit' })

  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder, { recursive: true })
  }

  const archiveSourcePath = path.join(path.dirname(distFolderPath), archiveName)
  const targetPath = path.join(targetFolder, archiveName)
  fs.renameSync(archiveSourcePath, targetPath)
  console.log(`📂 Moved compressed file to: ${targetPath}`)
  console.log('✅ Process completed successfully!')
}

while (true) {
  console.log('\nSelect build mode:')
  console.log('1) One Build')
  console.log("2) Multiple Builds (Enter comma-separated numbers, e.g., '1,3,5')")
  console.log("Press 'q' to quit")

  const buildMode = readline.question('Enter choice: ').trim()
  if (buildMode.toLowerCase() === 'q') {
    console.log('👋 Exiting...')
    break
  }

  console.log('\nAvailable environments:')
  envKeys.forEach((key, index) => {
    console.log(`${index + 1}) ${key}`)
  })

  const envChoice = readline.question('Select environment(s) (comma-separated numbers): ').trim()
  const envIndexes = envChoice.split(',').map(num => parseInt(num.trim(), 10) - 1)
  const selectedEnvs = envIndexes.filter(index => index >= 0 && index < envKeys.length).map(index => envKeys[index])

  if (selectedEnvs.length === 0) {
    console.error('❌ Invalid selection! Please try again.')
    continue
  }

  const wantsBaseHref = readline.question('Do you want to set a custom <base href>? (y/n): ').trim().toLowerCase()
  let baseHref = ''
  if (wantsBaseHref === 'y' || wantsBaseHref === 'yes') {
    baseHref = readline.question('Enter base href (must start and end with /): ').trim()
    if (!baseHref.startsWith('/') || !baseHref.endsWith('/')) {
      console.error('❌ Invalid base href. Must start and end with "/"')
      continue
    }
  }

  console.log(`🔄 Selected environments: ${selectedEnvs.join(', ')}`)
  for (const selectedEnv of selectedEnvs) {
    updateEnvironment(selectedEnv)
    buildAndCompress(selectedEnv, baseHref)
  }

  console.log('✅ All selected builds completed!')
  if (buildMode === '1') {
    break
  }
}

console.log('🎉 Process finished!')
