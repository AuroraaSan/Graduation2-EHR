# AI-Driven Electronic Health Records (EHR) System for Egypt

This project addresses critical challenges in the Egyptian healthcare system by implementing a scalable, secure, and AI-integrated EHR platform.  It leverages advanced technologies and a microservices architecture to enhance patient data management, diagnostic support, and clinical workflows.

## Features

* **Centralized Patient Data Management:** Securely stores comprehensive patient medical histories in a structured format within MongoDB. Data is organized by key entities (see ERD diagram below) allowing granular data management and efficient retrieval through a RESTful API.
    * **Key Entities:** Medical Conditions, Medications, Allergies, Surgeries, Lifestyle (including smoking, alcohol, diet, exercise), Hospital Visits/Exams (including diagnoses, treatments, referrals)
![Patient Service ERD](https://github.com/user-attachments/assets/4ab99752-6cc1-47fe-a2a8-9f1a7e4bbe3d)


* **AI-Powered Medical History Summarization:** Leverages the power of Llama3-OpenBioLLM-70B to generate concise summaries of patient medical histories.  This feature extracts key information from diverse data sources within the patient record, reducing information overload for physicians and aiding in faster, more informed decision-making. The summarization workflow is illustrated below:
![Summarization Workflow](https://github.com/user-attachments/assets/a1e8e91a-c9a8-48f7-bbde-495f41d1a9cd)

* **Automated Medical Report Generation:** Automates the generation of standardized medical reports based on the last patient visit, incorporating patient demographics, visit summaries, diagnoses, prescribed medications, vital signs, lab results, and AI-powered recommendations. This feature streamlines documentation and frees up physicians' time for patient care. 

* **AI-Driven Diagnostics (X-Ray Analysis):** Integrates a fine-tuned ViT X-Ray Pneumonia Classification model to analyze chest X-rays, providing diagnostic support to radiologists.  The model outputs a classification label (Pneumonia or Normal) with a confidence score, facilitating faster and more accurate diagnoses. Example of the results:
![X-Ray Results](https://github.com/user-attachments/assets/d90fdd89-4c96-4b64-a619-3cc3ccc2bdbc)

* **Interactive Chatbot:** Provides an AI-powered chatbot (Llama3-OpenBioLLM-70B) integrated into both patient and physician dashboards for intuitive access to information and support. The chatbot enables:
    * Real-time responses to medical queries
    * Appointment scheduling and reminders
    * Personalized health tips and medication reminders
    * Secure communication between patients and healthcare providers
      
![Chatbot Interaction](https://github.com/user-attachments/assets/19e63602-6512-440a-b7ea-458279a65307)


* **Secure Role-Based Access Control (RBAC):** Employs Auth0 for authentication and authorization, implementing granular access control based on user roles (Administrator, Doctor, Patient). This ensures data privacy and compliance with regulatory requirements.  JWT tokens and scopes are used for secure inter-service communication within the microservices architecture.  The system also utilizes an admission/discharge mechanism for further access control, aligning with Egypt's Data Protection Law.

* **Scalable Microservices Architecture:**  The backend is built using a microservices architecture with Node.js, Express.js, and a polyglot persistence strategy (PostgreSQL for user data, MongoDB for patient records and AI results, Redis for caching). This approach ensures scalability, maintainability, and fault isolation.  The architecture diagram below illustrates the interaction between microservices:
  
![High-Level System Architecture](https://github.com/user-attachments/assets/ff10c187-5b59-4c7a-8b64-f51dae26ef5f)


* **Automated Deployment Pipeline:** Utilizes a robust CI/CD pipeline powered by GitHub Actions, Docker, and Azure Kubernetes Service (AKS) for automated builds, testing, and deployments. Helm charts are used for managing deployment configurations, ensuring consistent and reproducible deployments across different environments. The pipeline diagram illustrates the process:
    
![CI/CD Pipeline](https://github.com/user-attachments/assets/57285cbc-84c5-4dcc-94a9-cb2dbaa34af0)


## AI Evaluation

The AI-powered medical summarization feature was rigorously evaluated using ROUGE (Recall-Oriented Understudy for Gisting Evaluation) and BERTScore.  ROUGE measures lexical overlap between generated summaries and reference summaries, while BERTScore assesses semantic similarity.

* **ROUGE Scores:**  High recall scores across ROUGE-1, ROUGE-2, and ROUGE-L indicate the model's ability to capture essential medical information.  However, lower precision scores for ROUGE-2 suggest potential redundancy and areas for optimization in phrase coherence.
* **BERTScore:**  High BERTScore (F1) values, exceeding 0.85, demonstrate the model's ability to generate summaries that preserve semantic meaning, even when wording differs from the reference summaries.  This is crucial in medical contexts where paraphrasing is common.

The results of these evaluations are visualized in the following figures:

![ROUGE F1](https://github.com/user-attachments/assets/c5fd538b-7dd0-48df-940c-11bc53168497)

![ROUGE Percision](https://github.com/user-attachments/assets/b9486ce2-b1ef-4adc-ab82-70ec43686a61)

![ROUGE Recall](https://github.com/user-attachments/assets/c78b18ba-1e07-4ad2-a6ab-a2db7b7d2a77)

![BERTScore Results](https://github.com/user-attachments/assets/4a983ccd-03af-4230-a21e-eda75d75661b)



Performance testing was conducted using k6 to assess the system's scalability and stability under realistic user loads. The tests simulated concurrent users accessing the user profile retrieval endpoint (`/api/user/profile`).  Results demonstrated excellent performance, with consistently low response times and minimal error rates, even during peak loads.  This validates the effectiveness of the chosen microservices architecture and the Kubernetes-based deployment on AKS.  The graph below shows the correlation between virtual users and response times:


![Performance Test Results](https://github.com/user-attachments/assets/eacde50a-450d-486a-a8db-f3214abc68f6)




## Impact

This project aims to have a significant positive impact on the Egyptian healthcare system by:

* **Improving data accessibility and quality:**  Providing a centralized and standardized platform for patient data management, enabling healthcare professionals to access complete and accurate information readily.
* **Enhancing diagnostic support:**  AI-powered tools like X-ray analysis and medical history summarization assist healthcare professionals in making faster and more informed diagnostic decisions.
* **Streamlining clinical workflows:** Automating tasks like medical report generation reduces administrative burden on physicians, freeing up more time for patient care.
* **Empowering patients:** Providing patients with access to their medical records and an interactive chatbot empowers them to take a more active role in managing their health.


## Frontend Development

The frontend of the EHR system is designed with a focus on user experience and efficient access to information. It provides distinct views tailored to the roles of administrators, doctors, and patients, ensuring a streamlined and intuitive workflow for each user group.

* **Technology Stack:** The frontend is built using modern web technologies:
    * **React with Vite:**  Provides a component-based architecture for modular development and fast performance. Vite offers a superior development experience with features like Hot Module Replacement (HMR) and optimized builds.
    * **TypeScript (TSX):** Enhances type safety, code maintainability, and developer productivity.  Reduces runtime errors by catching type-related issues during compilation.
    * **HTML & CSS:**  Used for structuring UI components and styling.
    * **Tailwind CSS:**  A utility-first CSS framework that enables rapid UI development and ensures consistency across components.

* **User Interfaces:**  The frontend provides distinct user interfaces tailored to specific roles:
    * **Administrator View:**  Provides functionalities for managing access control, user accounts, hospital information, and patient data addition requests.
    ![Administrator View](https://github.com/user-attachments/assets/7be895c7-5d6f-4ebf-825b-ed9e9a4ac845)

    * **Doctor View:** Offers tools for accessing patient histories, generating AI summaries, reviewing medical records, conducting examinations, uploading medical data, and accessing the chatbot.
    ![Doctor View](https://github.com/user-attachments/assets/1891a6e9-76c8-4c98-af1b-f614c368ef99)

    * **Patient View:** Allows patients to view their medical history, request data additions, access lab results and X-ray reports, schedule appointments, and communicate with healthcare providers through the chatbot.
    ![Patient View](https://github.com/user-attachments/assets/35c4eb79-1af7-4184-97d7-c632a96858ab)


* **User Authentication and Registration:**  Employs a secure and user-friendly authentication system powered by Auth0. Users can register with personal information, and National ID is used as a key identifier for patient registration, enabling quick access to information in case of emergencies.

* **Chatbot Integration:** The chatbot is seamlessly integrated into both the patient and doctor views, providing real-time support and medical advice.


## Future Work

* **Enhanced Interoperability:** Implementing HL7/FHIR standards for seamless integration with other healthcare systems.  Exploring the use of an integration engine like Mirth Connect to facilitate data exchange.
* **Advanced AI Capabilities:** Refining the summarization model with techniques like Retrieval-Augmented Generation (RAG) to incorporate external medical knowledge and improve conciseness.  Expanding the AI functionalities to include other disease classification models beyond pneumonia.
* **Localization and Personalization:** Fine-tuning the AI models on Egyptian-specific medical data and adding support for Arabic language to enhance relevance and accessibility.  Exploring personalized recommendations and predictive analytics based on individual patient data.


## Contributing

Contributions are welcome!  Please fork the repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.  See [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

## License

This project is licensed under the [MIT License](LICENSE).
