/*
 * Поведение шапки на страницах блога (их отдаёт PHP, без React):
 * мобильное меню и меню продуктов работают так же, как на остальном сайте.
 */
;(() => {
  'use strict'
  const header = document.querySelector('.site-header')
  if (!header) return

  const closeSvg =
    '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false"><path d="m4 4 12 12M16 4 4 16" stroke="currentColor" stroke-width="1.6"/></svg>'

  /* ---------- мобильное меню ---------- */
  const toggle = header.querySelector('.menu-toggle')
  const panel = document.getElementById('mobile-menu')
  const openIcon = toggle ? toggle.innerHTML : ''
  const outside = () => document.querySelectorAll('main, footer, .preview-bar')

  const setMenu = (open, returnFocus) => {
    if (!toggle || !panel) return
    panel.hidden = !open
    toggle.setAttribute('aria-expanded', String(open))
    header.classList.toggle('is-menu-open', open)
    document.documentElement.classList.toggle('menu-open', open)
    outside().forEach((el) => (open ? el.setAttribute('inert', '') : el.removeAttribute('inert')))
    toggle.innerHTML = open ? closeSvg + '<span class="visually-hidden">Закрыть меню</span>' : openIcon
    if (open) panel.querySelector('a, button')?.focus()
    else if (returnFocus) toggle.focus()
  }

  toggle?.addEventListener('click', () => setMenu(panel.hidden, false))
  window.matchMedia('(min-width: 1241px)').addEventListener('change', (e) => e.matches && setMenu(false, false))

  /* ---------- меню продуктов ---------- */
  const sub = header.querySelector('.has-sub')
  const subToggle = sub?.querySelector('.main-nav__toggle')
  const mega = sub?.querySelector('.mega')
  let hovering = false

  const setMega = (open) => {
    if (!sub || !mega) return
    mega.hidden = !open
    sub.classList.toggle('is-open', open)
    subToggle?.setAttribute('aria-expanded', String(open))
  }

  sub?.addEventListener('mouseenter', () => {
    hovering = true
    setMega(true)
  })
  sub?.addEventListener('mouseleave', () => {
    hovering = false
    setMega(false)
  })
  subToggle?.addEventListener('click', (e) => {
    // Клик мышью по уже открытому наведением меню не закрывает его; с клавиатуры — переключатель
    setMega(hovering && e.detail > 0 ? true : mega.hidden)
  })

  document.addEventListener('click', (e) => {
    if (sub && mega && !mega.hidden && !sub.contains(e.target)) setMega(false)
  })

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return
    if (panel && !panel.hidden) setMenu(false, true)
    if (mega && !mega.hidden) {
      setMega(false)
      subToggle?.focus()
    }
  })
})()
