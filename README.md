[![React](https://img.shields.io/badge/React-18.0+-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://www.javascript.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.0+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/)

You can find an overview of the project on Devpost: https://devpost.com/software/sereneed

Watch a demonstration of the project in action! : https://www.youtube.com/watch?v=ZDmFJplDQQc&ab_channel=CedricGarand

## Inspiration
Emergency departments are places of intense emotions and uncertainty. After analyzing the widespread problem of waiting room anxiety and reading about countless patient experiences, we were inspired to create a solution that transforms passive waiting time into an engaging, supportive experience. The realization that technology could bridge the gap between necessary wait times and patient wellbeing drove us to develop SerenED, turning a traditionally stressful experience into meaningful moments of connection and comfort.
## What it does
SerenED revolutionizes the emergency department waiting experience through three core features:

- A dynamic, heart-themed syringe visualization that provides real-time updates on wait times and patient status
- A customizable Parent vs. Illness fighting mini-game in classic Mortal Kombat style, cleverly designed so parents always emerge victorious, subtly reinforcing to anxious children that their guardians will triumph over any illness.
- An interactive social system allowing patients to connect through chat with others in similar situations through severity and wait time based matchmaking.
- Guided breathing exercises with relaxing music to reduce anxiety.

## How we built it
We developed SereneED using a modern tech stack focused on real-time interaction:
Frontend: React for a responsive, elegant UI
- Real-time updates: Socket.IO for live wait time tracking and chat functionality
- State Management: React hooks and context for seamless data flow
- API Integration: Connected to the provided mock API for patient data
- Animations: CSS animations and SVG manipulation for the dynamic syringe visualization
- Design: Custom heart-themed UI elements and smooth gradient transitions

## Challenges we ran into
- Balancing real-time updates with smooth animations while maintaining performance.
- Creating an intuitive visualization that conveys complex waiting time information without increasing anxiety.
- Implementing responsive design that works seamlessly across different devices and orientations
- Managing state across multiple features while maintaining clean code architecture
- Coordinating real-time updates between multiple users in the chat system

## Accomplishments that we're proud of
- Developed an innovative syringe visualization that makes wait times more comprehensible and less stressful
- Created a cohesive, design language that transforms clinical information into a comforting experience.
- Successfully implemented real-time features that maintain high performance.
- Built a social system that fosters connection while respecting privacy.
- Integrated multiple engagement features without overwhelming users.
- Integrating many elements to improve the users wait time.

## What we learned
- Techniques for handling real-time data updates efficiently.
- Strategies for creating engaging visualizations.
- Methods for balancing technical functionality with emotional design.
- The complexity of building social features within healthcare constraints.
