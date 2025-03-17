document.addEventListener('DOMContentLoaded', function() {
    // Définition des noms
    const masculineNames = ['Jean', 'Pierre', 'Luc', 'François', 'Michel', 'Louis', 'Henri', 'Marc', 'Paul', 'Alain'];
    const feminineNames = ['Marie', 'Sophie', 'Claire', 'Julie', 'Isabelle'];
  
    // Combinaison des noms (10 masculins + 5 féminins = 15 noms)
    const names = masculineNames.concat(feminineNames);
  
    // Fonction de mélange (shuffle) pour obtenir un ordre aléatoire
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
    shuffle(names);
  
    // Génération de l'équipe de 15 pompiers avec noms aléatoires, commentaire initial vide et flag "commentUnread"
    const firefighters = [];
    for (let i = 0; i < names.length; i++) {
      firefighters.push({
        id: i + 1,
        name: names[i],
        photo: "https://www.gravatar.com/avatar/?d=mp&f=y",
        status: "absent",
        comment: "",
        commentUnread: false
      });
    }
  
    // Références aux éléments du DOM
    const adminDashboard = document.getElementById('admin-dashboard');
    const pompierSelect = document.getElementById('pompier-select');
    const statusSelect = document.getElementById('status-select');
    const photoFileInput = document.getElementById('photo-file');
    const commentText = document.getElementById('comment-text');
    const commentSubmit = document.getElementById('comment-submit');
  
    // Modal
    const commentModal = document.getElementById('comment-modal');
    const modalFirefighterName = document.getElementById('modal-firefighter-name');
    const modalComment = document.getElementById('modal-comment');
    const modalClose = document.getElementById('modal-close');
    const modalCloseFooter = document.getElementById('modal-close-footer');
  
    // Bouton de basculement entre onglets
    const toggleTabBtn = document.getElementById('toggle-tab');
    const toggleLabel = document.getElementById('toggle-label');
  
    // Remplissage du dropdown de sélection du pompier dans l'onglet Pompier
    function populatePompierDropdown() {
      pompierSelect.innerHTML = '';
      firefighters.forEach(firefighter => {
        const option = document.createElement('option');
        option.value = firefighter.id;
        option.textContent = firefighter.name;
        pompierSelect.appendChild(option);
      });
    }
  
    // Met à jour le dropdown de statut et le champ commentaire pour le pompier sélectionné
    function updateStatusDropdown() {
      const selectedId = parseInt(pompierSelect.value);
      const firefighter = firefighters.find(f => f.id === selectedId);
      if (firefighter) {
        statusSelect.value = firefighter.status;
        commentText.value = "";
        commentText.placeholder = firefighter.comment ? firefighter.comment : "Votre commentaire ici";
      }
    }
  
    // Mise à jour de l'affichage de l'interface administrateur (trié par statut)
    function updateAdminDashboard() {
      adminDashboard.innerHTML = '';
      const statusOrder = { 'disponible': 0, 'indisponible': 1, 'absent': 2 };
      const sortedFirefighters = [...firefighters].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
      
      sortedFirefighters.forEach(firefighter => {
        const column = document.createElement('div');
        column.className = 'column is-one-third';
        const card = document.createElement('div');
        card.className = 'card';
  
        // Ouvre la modal au clic sur la carte et marque le commentaire comme lu
        card.addEventListener('click', function() {
          firefighter.commentUnread = false;
          updateAdminDashboard();
          openModal(firefighter);
        });
  
        const cardContent = document.createElement('div');
        cardContent.className = 'card-content';
        const media = document.createElement('div');
        media.className = 'media';
  
        // Partie avatar
        const mediaLeft = document.createElement('div');
        mediaLeft.className = 'media-left';
        const figure = document.createElement('figure');
        figure.className = 'image is-64x64';
        const img = document.createElement('img');
        img.src = firefighter.photo;
        img.alt = `Avatar de ${firefighter.name}`;
        figure.appendChild(img);
        mediaLeft.appendChild(figure);
  
        // Partie informations
        const mediaContent = document.createElement('div');
        mediaContent.className = 'media-content';
        const title = document.createElement('p');
        title.className = 'title is-4';
        title.textContent = firefighter.name;
        const subtitle = document.createElement('p');
        subtitle.className = 'subtitle is-6';
        const tag = document.createElement('span');
        tag.classList.add('tag');
        if (firefighter.status === 'disponible') {
          tag.classList.add('disponible');
          tag.textContent = 'Disponible';
        } else if (firefighter.status === 'indisponible') {
          tag.classList.add('indisponible');
          tag.textContent = 'Indisponible';
        } else {
          tag.classList.add('absent');
          tag.textContent = 'Absent';
        }
        subtitle.appendChild(tag);
        
        // Ajout de l'indicateur si un commentaire non lu existe
        if (firefighter.comment && firefighter.commentUnread) {
          const unreadIndicator = document.createElement('span');
          unreadIndicator.className = 'unread-indicator';
          unreadIndicator.textContent = '1';
          subtitle.appendChild(unreadIndicator);
        }
  
        mediaContent.appendChild(title);
        mediaContent.appendChild(subtitle);
        media.appendChild(mediaLeft);
        media.appendChild(mediaContent);
        cardContent.appendChild(media);
        card.appendChild(cardContent);
        column.appendChild(card);
        adminDashboard.appendChild(column);
      });
    }
  
    // Ouvre la modal pour afficher le commentaire
    function openModal(firefighter) {
      modalFirefighterName.textContent = firefighter.name;
      modalComment.textContent = firefighter.comment ? firefighter.comment : "Aucun commentaire";
      commentModal.classList.add('is-active');
    }
  
    // Ferme la modal
    function closeModal() {
      commentModal.classList.remove('is-active');
    }
  
    modalClose.addEventListener('click', closeModal);
    modalCloseFooter.addEventListener('click', closeModal);
    commentModal.querySelector('.modal-background').addEventListener('click', closeModal);
  
    // Mise à jour du statut via le dropdown
    statusSelect.addEventListener('change', function() {
      const selectedId = parseInt(pompierSelect.value);
      const firefighter = firefighters.find(f => f.id === selectedId);
      if (firefighter) {
        firefighter.status = statusSelect.value;
        updateAdminDashboard();
      }
    });
  
    // Lecture de l'image sélectionnée
    photoFileInput.addEventListener('change', function() {
      const file = photoFileInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const selectedId = parseInt(pompierSelect.value);
          const firefighter = firefighters.find(f => f.id === selectedId);
          if (firefighter) {
            firefighter.photo = e.target.result;
            updateAdminDashboard();
          }
        };
        reader.readAsDataURL(file);
      }
    });
  
    // Validation du commentaire : on le stocke et on marque comme non lu
    commentSubmit.addEventListener('click', function() {
      const selectedId = parseInt(pompierSelect.value);
      const firefighter = firefighters.find(f => f.id === selectedId);
      if (firefighter) {
        firefighter.comment = commentText.value;
        firefighter.commentUnread = true;
        updateAdminDashboard();
        commentText.value = "";
        commentText.placeholder = firefighter.comment;
      }
    });
  
    pompierSelect.addEventListener('change', updateStatusDropdown);
  
    // Basculement entre onglets via le bouton de navigation
    toggleTabBtn.addEventListener('click', function() {
      const adminTab = document.getElementById('admin-tab');
      const pompierTab = document.getElementById('pompier-tab');
      if (adminTab.classList.contains('active')) {
        adminTab.classList.remove('active');
        pompierTab.classList.add('active');
        toggleLabel.textContent = "Passer à l'onglet Administrateur";
      } else {
        pompierTab.classList.remove('active');
        adminTab.classList.add('active');
        toggleLabel.textContent = "Passer à l'onglet Pompier";
      }
    });
  
    // Initialisation
    populatePompierDropdown();
    updateStatusDropdown();
    updateAdminDashboard();
  });
  