const {client} = require('tre-client')
const Importer = require('tre-file-importer')
const h = require('mutant/html-element')
const setStyle = require('module-styles')('tre-images-demo')
const TwoRenderStacks = require('abundance/two-render-stacks')
const Abundance = require('abundance')
const pull = require('pull-stream')

require('brace/theme/solarized_dark')

const Images = require('tre-images')
const Videos = require('tre-videos')
const TextTracks = require('tre-texttracks')
const Fonts = require('tre-fonts')
const Stylesheets = require('tre-stylesheets')
const Folders = require('tre-folders')
const Stations = require('abundance/station-renderer')
const Emoji = require('abundance/emoji-styles')
const Icons = require('abundance/icons-by-name')

const Dates = require('tre-dates')
const Calendar = require('tre-calendar')

client( (err, ssb, config) => {
  console.log('config', config)
  if (err) return console.error(err)

  const importer = Importer(ssb, config)
          .use(Images)
          .use(TextTracks)
          .use(Fonts)
          .use(Stylesheets)
          .use(Videos) // last because it grabs .vtt (TODO)

  const prototypes = config.tre.prototypes

  const renderStack = TwoRenderStacks(ssb)
  const {render, renderTile} = renderStack
  const renderImage = Images(ssb, {
    prototypes
  })
  const renderVideo = Videos(ssb, {
    prototypes
  })
  const renderTextTracks = TextTracks(ssb, {
    prototypes
  })
  const renderFont = Fonts(ssb, {
    prototypes
  })
  const renderStylesheet = Stylesheets(ssb, {
    prototypes
  })
  const renderFolder = Folders(ssb, {
    prototypes,
    renderTile
  })
  const renderStation = Stations(ssb, {
    renderEntry: render
  })
  const renderDate = Dates(ssb)
  const renderCalendar = Calendar(ssb)

  const iconByName = Icons(ssb, config)
  const emojiStyles = Emoji(ssb, config)

  renderStack
    .use(renderImage)
    .use(renderVideo)
    .use(renderTextTracks)
    .use(renderFont)
    .use(renderStylesheet)
    .use(renderFolder)
    .use(renderStation)
    .use(renderDate)
    .use(renderCalendar)
    .use(function(kv, ctx) {
      if (!kv) return
      if (kv.value.content.type !== 'folder') return
      if (ctx.where !== 'tile') return
      return iconByName('folder open', ctx)
    })

  document.head.appendChild(emojiStyles())
  document.body.appendChild(Abundance(ssb, config, {
    ace: {
      theme: 'ace/theme/solarized_dark',
    },
    importer,
    render
  }))
})

