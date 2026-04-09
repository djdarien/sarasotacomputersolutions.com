// Unified site navigation toggle script
(function(){
  function initNav(){
    var hamburgers = document.querySelectorAll('.hamburger');
    var nav = document.getElementById('mainNav');
    var overlay = document.getElementById('navOverlay');

    function setAria(h, open){
      try{ h.setAttribute('aria-expanded', String(!!open)); }catch(e){}
    }

    function toggle(h){
      if(!nav) return;
      var open = nav.classList.toggle('open');
      hamburgers.forEach(function(btn){ btn.classList.toggle('active', open); setAria(btn, open); });
      if(overlay) overlay.classList.toggle('active', open);
      // Force transform inline as a robust fallback for browsers with stacking/stylesheet ordering issues
      try{
        if(open){ nav.style.transform = 'translateX(0)'; }
        else { nav.style.transform = ''; }
      }catch(e){}
      if(open){
        // focus first focusable in nav
        var first = nav.querySelector('a,button'); if(first) first.focus();
      } else {
        // close any open dropdowns when nav closes
        document.querySelectorAll('.dropdown.open').forEach(function(dd){ dd.classList.remove('open'); var toggle = dd.querySelector('.dropdown-toggle'); if(toggle) try{ toggle.setAttribute('aria-expanded','false'); }catch(e){} });
      }
    }

    hamburgers.forEach(function(h){
      if(!h) return;
      h.setAttribute('aria-controls', 'mainNav');
      // avoid attaching duplicate listeners
      if(!h.dataset.navInit){
        h.addEventListener('click', function(e){ e.preventDefault(); toggle(h); });
        h.dataset.navInit = '1';
      }
    });

    // Dropdown toggles (open/close submenu)
    document.querySelectorAll('.dropdown-toggle').forEach(function(dt){
      if(!dt.dataset.ddInit){
        dt.addEventListener('click', function(e){
          e.preventDefault();
          var d = dt.closest('.dropdown');
          if(!d) return;
          var willOpen = !d.classList.contains('open');
          // close other open dropdowns inside the same nav
          document.querySelectorAll('.dropdown.open').forEach(function(other){ if(other !== d) other.classList.remove('open'); });
          d.classList.toggle('open', willOpen);
          try{ dt.setAttribute('aria-expanded', String(!!willOpen)); }catch(e){}
        });
        dt.dataset.ddInit = '1';
      }
    });

    if(overlay && !overlay.dataset.navInit){
      overlay.addEventListener('click', function(){ if(nav && nav.classList.contains('open')){ nav.classList.remove('open'); hamburgers.forEach(function(b){ b.classList.remove('active'); setAria(b,false); }); overlay.classList.remove('active'); } });
      overlay.dataset.navInit = '1';
    }

    // Close on Escape
    if(!document.body.dataset.navEscInit){
      document.addEventListener('keydown', function(ev){ if(ev.key === 'Escape'){ if(nav && nav.classList.contains('open')){ nav.classList.remove('open'); hamburgers.forEach(function(b){ b.classList.remove('active'); setAria(b,false); }); if(overlay) overlay.classList.remove('active'); } } });
      document.body.dataset.navEscInit = '1';
    }
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initNav); else initNav();
})();
