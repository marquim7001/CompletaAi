document.addEventListener('DOMContentLoaded', () => {
    // Função para buscar eventos da API
    const fetchEvents = async () => {
      try {
        const response = await fetch('/events');
        const events = await response.json();
  
        const eventList = document.getElementById('event-list');
        eventList.innerHTML = '';  // Limpa a lista antes de adicionar novos itens
  
        events.forEach(event => {
          const li = document.createElement('li');
          li.textContent = `${event.name} - ${event.date} at ${event.location}`;
          eventList.appendChild(li);
        });
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
  
    fetchEvents();
  });
  