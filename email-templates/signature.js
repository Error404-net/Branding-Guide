/*
  ERROR404.NET — Outlook / M365 email signature builder.

  Single source of truth for the signature markup. index.html's "Email signature"
  section loads this to render the live preview and to power the copy buttons; the
  static Error404-M365-Signature-*.html files in this folder are its output with
  <Bracketed> placeholders.

  Outlook-safe by construction: tables for layout, inline styles only, no CSS
  classes, no web fonts, no margins on block elements (Outlook desktop's Word
  engine ignores most of them). Images are hosted on the brand site's GitHub
  Pages deploy so they survive replies/forwards instead of being re-embedded.

  Colors: #231451 (brand navy) for the name/wordmark, #111111 (print-mode black)
  for body text, #4DE1FF accent rule only as a decorative divider — never as text,
  since cyan on white fails contrast. The tagline is deliberately absent (see
  BRAND.md § Tagline & Slogans — signature exception).
*/
(function (root) {
  'use strict';

  var IMG_BASE = 'https://branding.error404.net/email-templates/hosted-images/';
  var SITE_URL = 'https://error404.net';
  var NAVY = '#231451';
  var INK = '#111111';
  var ACCENT = '#4DE1FF';
  var MONO = "'Courier New',Courier,monospace";
  var SANS = "'Segoe UI',Calibri,Arial,sans-serif";

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // Keep digits and a leading + so tel: links dial correctly.
  function telHref(phone) {
    var digits = String(phone).replace(/[^\d+]/g, '');
    return 'tel:' + (digits || phone);
  }

  function link(href, text, style) {
    return '<a href="' + esc(href) + '" style="' + style + ' text-decoration:none;">' + text + '</a>';
  }

  function standard(d) {
    var parts = [];
    if (d.email) parts.push(link('mailto:' + d.email, esc(d.email), 'color:' + INK + ';'));
    if (d.phone) parts.push(link(telHref(d.phone), esc(d.phone), 'color:' + INK + ';'));
    var contact = parts.length
      ? '~/ ' + parts.join(' <span style="color:' + NAVY + ';">::</span> ')
      : '';

    var rows = [
      '<tr><td style="font-family:' + MONO + '; font-size:15px; font-weight:bold; color:' + NAVY + '; line-height:20px; padding:0;">' + esc(d.name) + '</td></tr>'
    ];
    if (d.title) {
      rows.push('<tr><td style="font-family:' + SANS + '; font-size:13px; color:' + INK + '; line-height:18px; padding:0;">' + esc(d.title) + '</td></tr>');
    }
    if (contact) {
      rows.push('<tr><td style="font-family:' + MONO + '; font-size:12px; color:' + INK + '; line-height:18px; padding:6px 0 0 0;">' + contact + '</td></tr>');
    }
    rows.push('<tr><td style="font-family:' + MONO + '; font-size:12px; font-weight:bold; letter-spacing:1px; line-height:18px; padding:2px 0 0 0;">' +
      link(SITE_URL, 'ERROR404.NET', 'color:' + NAVY + ';') + '</td></tr>');

    return '' +
      '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">' +
        '<tr>' +
          '<td valign="middle" style="padding:0 14px 0 0; border-right:2px solid ' + ACCENT + ';">' +
            '<img src="' + IMG_BASE + 'signature-mark-88.png" width="44" height="44" alt="ERROR404.NET" style="display:block; width:44px; height:44px; border:0;">' +
          '</td>' +
          '<td valign="middle" style="padding:0 0 0 14px;">' +
            '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">' +
              rows.join('') +
            '</table>' +
          '</td>' +
        '</tr>' +
      '</table>';
  }

  function minimal(d) {
    var bits = ['<span style="font-family:' + MONO + '; font-weight:bold; color:' + NAVY + ';">' + esc(d.name) + '</span>'];
    if (d.title) bits.push(esc(d.title));
    var line = bits.join(' &middot; ') +
      ' <span style="color:' + NAVY + ';">::</span> ' +
      link(SITE_URL, 'ERROR404.NET', 'font-family:' + MONO + '; font-weight:bold; color:' + NAVY + ';');

    return '' +
      '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">' +
        '<tr>' +
          '<td valign="middle" style="padding:0 8px 0 0;">' +
            '<img src="' + IMG_BASE + 'signature-mark-48.png" width="24" height="24" alt="" style="display:block; width:24px; height:24px; border:0;">' +
          '</td>' +
          '<td valign="middle" style="font-family:' + SANS + '; font-size:13px; color:' + INK + '; line-height:18px; padding:0;">' + line + '</td>' +
        '</tr>' +
      '</table>';
  }

  // Plain-text twin, for clients that paste text only. Mirrors the brand's
  // "Name ~/ email :: phone" notation from index.html § Email signature.
  function plain(d, variant) {
    if (variant === 'minimal') {
      return [d.name, d.title].filter(Boolean).join(' · ') + ' :: ERROR404.NET';
    }
    var first = d.name + (d.title ? ' · ' + d.title : '');
    var contact = [d.email, d.phone].filter(Boolean).join(' :: ');
    return [first, contact ? '~/ ' + contact : '', 'ERROR404.NET'].filter(Boolean).join('\n');
  }

  function build(data, variant) {
    var d = {
      name: (data.name || '').trim(),
      title: (data.title || '').trim(),
      email: (data.email || '').trim(),
      phone: (data.phone || '').trim()
    };
    return {
      html: variant === 'minimal' ? minimal(d) : standard(d),
      text: plain(d, variant)
    };
  }

  root.Error404Signature = { build: build, IMG_BASE: IMG_BASE };
})(typeof window !== 'undefined' ? window : globalThis);
