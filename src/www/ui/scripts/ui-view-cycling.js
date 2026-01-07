/**
 * SPDX-FileCopyrightText: © 2024 FOSSology contributors
 * SPDX-License-Identifier: FSFAP
 *
 * Logic for cycling through evidence and context menu operations in UI View.
 */

var EvidenceCycler = {
  types: {
    'copyright': '.hi-cp',
    'email': '.hi-email',
    'url': '.hi-url',
    'license': '.hi-match'
  },
  currentIndex: {
    'copyright': -1,
    'email': -1,
    'url': -1,
    'license': -1
  },
  
  init: function() {
    this.createToolbar();
    this.createContextMenu();
    
    // Attach context menu listeners
    document.querySelectorAll('.hi-cp, .hi-email, .hi-url, .hi-match').forEach(el => {
      el.addEventListener('contextmenu', (e) => this.showContextMenu(e, el));
    });

    // Close context menu on click elsewhere
    document.addEventListener('click', () => {
      document.getElementById('evidence-context-menu').style.display = 'none';
    });
  },

  createToolbar: function() {
    const toolbar = document.createElement('div');
    toolbar.id = 'evidence-toolbar';
    toolbar.innerHTML = `
      <div class="evidence-group">
        <span>Copyrights:</span>
        <button onclick="EvidenceCycler.cycle('copyright', -1)">Prev</button>
        <button onclick="EvidenceCycler.cycle('copyright', 1)">Next</button>
      </div>
      <div class="evidence-group">
        <span>Emails:</span>
        <button onclick="EvidenceCycler.cycle('email', -1)">Prev</button>
        <button onclick="EvidenceCycler.cycle('email', 1)">Next</button>
      </div>
      <div class="evidence-group">
        <span>URLs:</span>
        <button onclick="EvidenceCycler.cycle('url', -1)">Prev</button>
        <button onclick="EvidenceCycler.cycle('url', 1)">Next</button>
      </div>
      <div class="evidence-group">
        <span>Licenses:</span>
        <button onclick="EvidenceCycler.cycle('license', -1)">Prev</button>
        <button onclick="EvidenceCycler.cycle('license', 1)">Next</button>
      </div>
    `;
    document.body.appendChild(toolbar);
  },

  createContextMenu: function() {
    const menu = document.createElement('div');
    menu.id = 'evidence-context-menu';
    menu.innerHTML = `
      <ul>
        <li onclick="EvidenceCycler.copySelection()">Copy Value</li>
        <!-- Add more options here later -->
      </ul>
    `;
    document.body.appendChild(menu);
  },

  cycle: function(type, direction) {
    const selector = this.types[type];
    const elements = document.querySelectorAll(selector);
    
    if (elements.length === 0) {
      alert('No evidence of type ' + type + ' found.');
      return;
    }

    // Remove active class from previous
    if (this.currentIndex[type] !== -1 && elements[this.currentIndex[type]]) {
      elements[this.currentIndex[type]].classList.remove('active-highlight');
    }

    // Update index
    this.currentIndex[type] += direction;
    
    // Wrap around
    if (this.currentIndex[type] >= elements.length) {
      this.currentIndex[type] = 0;
    } else if (this.currentIndex[type] < 0) {
      this.currentIndex[type] = elements.length - 1;
    }

    // Highlight and scroll
    const el = elements[this.currentIndex[type]];
    el.classList.add('active-highlight');
    el.scrollIntoView({behavior: "smooth", block: "center"});
  },

  showContextMenu: function(e, element) {
    e.preventDefault();
    this.activeElement = element;
    const menu = document.getElementById('evidence-context-menu');
    menu.style.display = 'block';
    menu.style.left = e.pageX + 'px';
    menu.style.top = e.pageY + 'px';
  },

  copySelection: function() {
    if (this.activeElement) {
      navigator.clipboard.writeText(this.activeElement.textContent);
    }
  }
};

document.addEventListener('DOMContentLoaded', function() {
  EvidenceCycler.init();
});
