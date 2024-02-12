
async function loadPageContent() {
  const urlInput = document.getElementById('urlInput').value;
  const contentContainer = document.getElementById('contentContainer');

  // Vérifier si l'URL est non vide avant de charger le contenu
  if (urlInput.trim() !== "") {
      try {
          // Utiliser fetch pour récupérer le contenu de l'URL
          const response = await fetch(urlInput);
          const content = await response.text();

          // Afficher le contenu dans le div
          contentContainer.innerHTML = content;
      } catch (error) {
          console.error("Erreur lors du chargement de la page :", error);
          contentContainer.innerHTML = "<p>Erreur lors du chargement de la page. Veuillez vérifier l'URL.</p>";
      }
  } else {
      alert("Veuillez entrer une URL valide.");
  }
}

async function fetchJsonFile(filename) {
  const response = await fetch(filename);
  const data = await response.json();
  return data;
}

async function generateFormFields() {
  const criteriaData = await fetchJsonFile('https://ecoresponsable.numerique.gouv.fr/publications/referentiel-general-ecoconception/export/referentiel-general-ecoconception-version-v1.json');
  const form = document.getElementById('ratingForm');


  for (const criterion of criteriaData.criteres) {
      const criterionGroup = document.createElement('div');
      criterionGroup.classList.add('criterion-group', 'mb-3', 'p-3', 'rounded', 'border');

      const label = document.createElement('label');
      label.textContent = `${criterion.critere}:`;
      criterionGroup.appendChild(label);


      const options = ["Conformes", "En cours de déploiement", "Non conformes", "Non applicables"];

      for (const option of options) {
          const radioField = document.createElement('div');
          radioField.classList.add('form-check');

          const input = document.createElement('input');
          input.classList.add('form-check-input');
          input.type = 'radio';
          input.name = criterion.id;
          input.value = option.toLowerCase();

          const optionLabel = document.createElement('label');
          optionLabel.classList.add('form-check-label');
          optionLabel.textContent = option;

          radioField.appendChild(input);
          radioField.appendChild(optionLabel);

          criterionGroup.appendChild(radioField);
      }

      form.appendChild(criterionGroup);

  }
}
// Ajouter une variable note et mettre à jour sa valeur lorsqu'une case est cochée
async function generateFormFields() {
  const criteriaData = await fetchJsonFile('https://ecoresponsable.numerique.gouv.fr/publications/referentiel-general-ecoconception/export/referentiel-general-ecoconception-version-v1.json');
  const form = document.getElementById('ratingForm');

  let note = 0; // Initialiser la note
  let total = 0;
  let non_conforme = 0
  let total_critere = 0

  for (const criterion of criteriaData.criteres) {
      const criterionGroup = document.createElement('div');
      criterionGroup.classList.add('criterion-group', 'mb-3', 'p-3', 'rounded', 'border');

      const label = document.createElement('label');
      label.textContent = `${criterion.critere}:`;
      criterionGroup.appendChild(label);

      const options = ["Conformes", "En cours de déploiement", "Non conformes", "Non applicables"];

      for (const option of options) {
          const radioField = document.createElement('div');
          radioField.classList.add('form-check');

          const input = document.createElement('input');
          input.classList.add('form-check-input');
          input.type = 'radio';
          input.name = criterion.id;
          input.value = option.toLowerCase();

          // Ajouter un événement "change" pour mettre à jour la note lorsqu'une case est cochée
          input.addEventListener('change', () => {
              // Mettre à jour la note avec la valeur associée à l'option cochée
              switch (input.value) {
                  case "conformes":
                      note = note + 1;
                      total_critere = total_critere + 1
                      break;
                  case "en cours de déploiement":
                      total_critere = total_critere + 1
                      break;
                  case "non conformes":
                      total_critere = total_critere + 1
                      break;
                  case "non applicables":
                      total_critere = total_critere + 1
                      non_conforme = non_conforme + 1;
                      break;
                  default:
                      note = 0;
                      break;
              }

              score = (note / (total_critere - non_conforme)) * 100;
              const totalScoreDiv = document.querySelector('#totalScore');
              totalScoreDiv.textContent = score;
          });

          const optionLabel = document.createElement('label');
          optionLabel.classList.add('form-check-label');
          optionLabel.textContent = option;

          radioField.appendChild(input);
          radioField.appendChild(optionLabel);

          criterionGroup.appendChild(radioField);
      }

      form.appendChild(criterionGroup);
  }
}

async function generatePDF() {
    await generateFormFields(); // Générer les champs du formulaire dynamiquement
  
    const pdfOptions = {
      margin: 10,
      filename: 'synthese_notation.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
  
    const pdfContent = document.getElementById('ratingForm');
  
    html2pdf().from(pdfContent).set(pdfOptions).outputPdf().then(function (pdf) {
      // Convertir le PDF en chaîne de caractères base64
      const pdfString = pdf.output('datauristring');
  
      // Rediriger vers http://service
      window.location.href = 'http://service';
    });
  }
  




generateFormFields(); // Appeler cette fonction au chargement pour générer les champs du formulaire initiaux
