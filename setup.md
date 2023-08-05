
#### 1. Install virtualenv with command:

`pip install virtualenv`

#### 2. Create virtual environment in command prompt 
(I've used the folder name momuwebapp here but you could change it to anything you like). 
Note: The virtual environment does not need to be in the same directory as the project folder

`virtualenv momuwebapp`

#### 3. Activate virtual environment

`cd momuwebapp`

##### For Windows: 

`Scripts\activate`

##### For macOS:

`source bin/activate`

Once virtual environment is activated, we should be able to see a (<environment_name>) at the beginning of the terminal prompt

#### 4. Navigate to project folder 
`momudash-project > momudashsite`

there should be a text file called requirements.txt

#### 5. Install relevant libraries while virtualenv is activated by running command:
`pip install -r requirements.txt`

#### 6. Run webtool with following command:
`python manage.py migrate`
`python manage.py runserver`