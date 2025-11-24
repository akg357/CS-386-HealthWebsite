# D6 Implementation 2

## 1. Introduction

**Description:**
**Value Proposition:**
**Repistory: (link to github)**
**MVP:**
1. **Description: Strive is a health-tracking system designed to help individuals improve their physical well-being through clear, science-backed guidance. Many people struggle with understanding diets, workout plans, and the overwhelming amount of nutrition information available. Strive addresses this by offering a streamlined platform where users can calculate macros, plan goals, and receive general recommendations. The system prioritizes clarity, simplicity, and actionable insights, especially for athletes such as wrestlers and fighters who must meet precise weight goals.
2. **Value Proposition: Strive reduces confusion and decision-fatigue by consolidating essential health tools, such as BMI calculation, macro planning, and meal suggestions, into one intuitive interface. Instead of sifting through conflicting advice, users receive personalized, data-driven guidance to help them reach their goals more efficiently.
3. **Repistory: (link to github)https://github.com/akg357/CS-386-HealthWebsite.git
4. **MVP: The MVP focuses on delivering the core functionality users rely on most
BMI Calculator: Supports both metric and imperial systems through a clean interface
Macro Calculator: Provides protein and carbohydrate recommendations tailored to user-defined weight goals
Basic Meal Suggestions: Recommends options based on user's calorie and macro requirements.

## 2. Implemented Requirements 

### 2.1 Anna Cheatham

1. **Requirement:** 
2. **Issue Link:** 
3. **Pull Request Link:** 
4. **Implemented By:** 
5. **Approved By:** 
6. **Automated Tests:** 
7. **Visual Evidence:** 

### 2.2 Josselin Retiguin

1. **Requirement:** 
2. **Issue Link:** 
3. **Pull Request Link:** 
4. **Implemented By:** 
5. **Approved By:** 
6. **Automated Tests:** 
7. **Visual Evidence:** 

### 2.3 Aron Gebrezghr

1. **Requirement:**
   As a user who visits the site, I want a navigation bar and a Resources page so that I can easily move between pages and quickly find approved health information.

3. **Issue Link:** 
4. **Pull Request Link:** 
5. **Implemented By:** 
6. **Approved By:** 
7. **Automated Tests:** 
8. **Visual Evidence:**



 ### 2.4 Abel Gebrezghr

1. **Requirement:** 
2. **Issue Link:** 
3. **Pull Request Link:** 
4. **Implemented By:** 
5. **Approved By:** 
6. **Automated Tests:** 
7. **Visual Evidence:** 
1. **Requirement:** As a user , I want to write down my contact information so that medical experts can reach out to me for guidance .
2. **Issue Link:** https://github.com/akg357/CS-386-HealthWebsite/issues/30 
3. **Pull Request Link:** https://github.com/akg357/CS-386-HealthWebsite/pull/31
4. **Implemented By:** Abel Gebrezghr
5. **Approved By:**  Aron Gebrezghr
6. **Automated Tests:** https://github.com/akg357/CS-386-HealthWebsite/blob/contact-form-feature/tests/contactForm.test.js 
7. **Visual Evidence:** https://drive.google.com/file/d/1OzDDvqh-n7Q1LqS6QOmMJMUkGLcAQWQj/view?usp=sharing 


### 2.5 Emory WIlliams

1. **Requirement:** 
2. **Issue Link:** 
3. **Pull Request Link:** 
4. **Implemented By:** 
5. **Approved By:** 
6. **Automated Tests:** 
7. **Visual Evidence:** 

 ### 2.6 Ethan Senger

1. **Requirement:** 
2. **Issue Link:** 
3. **Pull Request Link:** 
4. **Implemented By:** 
5. **Approved By:** 
6. **Automated Tests:** 
7. **Visual Evidence:** 
1. **Requirement:**  As someone who exercises regularly, I want to get exercise recommendations so that I can exercise based on my personal needs. #12
2. **Issue Link:**  https://github.com/akg357/CS-386-HealthWebsite/issues/12
3. **Pull Request Link:** 
4. **Implemented By:**  Ethan Senger
5. **Approved By:** 
6. **Automated Tests:** 
7. **Visual Evidence:** https://docs.google.com/document/d/1cpObD6Wz5aAuojys6iUfkJjiqrRQDonPdLDNJUbSj8o/edit?usp=sharing

## 3. Automated Testing 

### 3.1 Unit Tests

**Test Framework:**
**GitHub Repository Link:**
**Detailed Example of Unit Test:**
**Screenshot:**

### 3.2 Integration Tests

**Test Framework/Tools:Mocha + JSDOM**
**GitHub Repository Link:https://github.com/akg357/CS-386-HealthWebsite/blob/main/tests/test_integration.js**
**Description of Scenario:Tests how the bmi interacts with main.js file and how the macro calculations interact 
      with the macros.js file**
**Example of Complete integration Test Case: the https://github.com/akg357/CS-386-HealthWebsite/blob/main/tests/test_integration.js 
       it shows the calls of the js files and how it has to wait for the attachment**
**Screenshot:               
<img width="589" height="109" alt="Screenshot 2025-11-23 at 9 20 15 PM" src="https://github.com/user-attachments/assets/507e6364-bb6f-4019-95e4-5f48c9ad39c9" />   **

### 3.3 Acceptance Tests

**Testing Tools** Cypress
**GitHub Repository Link:** https://github.com/akg357/CS-386-HealthWebsite/tree/contact-form-feature/cypress/e2e
**Detailed Example of Acceptance Test:**  
User story: As a user, I want to submit my contact information so that medical or fitness personnel can reach me.

Step-by-step test scenario: 
1. Open http://127.0.0.1:5500/index.html
3. Enter "Abel" into the Name area
4. Enter "Abel@gmail.com" into the Email area
5. wrote "I want guidance on healthy weight." into the text area
6. Submit form 
7. Got the  "Thank you for contacting us!" message

Expected outcomes: user fills out sheet and gets confirmation  message when completed
GitHub link = https://github.com/akg357/CS-386-HealthWebsite/blob/contact-form-feature/cypress/e2e/contactForm.cy.js 
Code snippet: 
('Contact Form Acceptance Test', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:5500/index.html'); // Use your Live Server URL
  });


  it('should allow a user to fill and submit the contact form', () => {
    cy.get('#contactForm').should('be.visible');
    cy.get('#name').type('John Doe');
    cy.get('#email').type('john@example.com');
    cy.get('#message').type('I want guidance on healthy weight.');
    cy.get('#btnSubmit').click();
    cy.get('.successMessage')
      .should('be.visible')
      .and('contain', 'Thank you for contacting us!');
  });
});


**Screenshot:**
https://docs.google.com/document/d/1Ta0Ohe0qjkDtLIgQHmcinaFMNDcYUybAS4olP-44lMA/edit?usp=sharing
## 4. System Demonstration

**Video Link:**

## 5. AI-Assisted Code Quality Review
Abels ai feedback
1.Test that the form shows an error when required fields are left blank.
2.Verify that an invalid email address triggers a validation error.
3.Check that very long messages can be submitted without breaking the form.
4.Ensure the form can be submitted multiple times in a row without issues.
Citation: AI-generated suggestions by ChatGPT, OpenAI, 2025.

### 5.1 AI Interaction

**Tool Used:**
**Prompt Engineering:**
**Conversion Link: (if applicable)**


### 5.2 Detailed Analysis and Response

--this will have to be done for each AI suggestion--

**AI Feedback:**
**Assigned Reviewer**
**Severity Assesment:**
**Decision:**
**Explanation:**

### 5.3 Individual Reflection

**Anna Cheatham: (Mark if completed)**
**Josselin Retiguin: (Mark if completed)**
**Aron Gebrezghr: (Mark if completed)**
**Abel Gebrezghr: (Mark if completed)**
**Emory WIlliams: (Mark if completed)**
**Ethan Senger: (Mark if completed)**

## 6. Retrosepctive Analysis

**Key Learnings:**
**Challenges Overcome:**
**Future Improvements:**
