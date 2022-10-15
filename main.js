//book class :represent a book

class Book{
    constructor(title,author,isbn){
        this.title=title;
        this.author=author;
        this.isbn=isbn;
    }
}



//UI class : handle ui task
class UI{
    static displayBooks(){

        const books=Store.getBooks();

        books.forEach((book)=>UI.addBookToList(book));
    }
    static addBookToList(book){
        const list=document.querySelector('#book-list');

        const row=document.createElement('tr');

        row.innerHTML=`
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">x</a></td>

        `;

        list.appendChild(row);
    }
    static deleteBook(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message,className){
        const div=document.createElement('div');
        div.className=`alert alert-${className} text-center`;
        div.appendChild(document.createTextNode(message));
        const container=document.querySelector('.container');
        const form=document.querySelector('#book-form');
        container.insertBefore(div,form);

        //make vanish in 3 sec
        setTimeout(()=>document.querySelector('.alert').remove(),3000);

    }
    static clearFields(){
        document.querySelector('#title').value='';
        document.querySelector('#author').value='';
        document.querySelector('#isbn').value='';

    }
}

//Store Class : handle Storage
class Store{
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books=[]
        }else{
            books=JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book){
        const books=Store.getBooks();

        books.push(book);

        localStorage.setItem('books',JSON.stringify(books));

    }
    
    static removeBook(isbn){
        const books=Store.getBooks();

        books.forEach((book,index)=>{
            if(book.isbn === isbn){
                books.splice(index,1);
            }
        });

        localStorage.setItem('books',JSON.stringify(books));
    }
}

//Event : display books
document.addEventListener('DOMContentLoaded',UI.displayBooks);

//Event : add books
document.addEventListener('submit',(e)=>{

    //preventing to actual submit
    e.preventDefault();

    //get form values
    const title=document.querySelector('#title').value;
    const author=document.querySelector('#author').value;
    const isbn=document.querySelector('#isbn').value;

    //Validate
    if(title === '' || author === '' || isbn === ''){
        //show error message
       UI.showAlert('Please fill in all fields','danger');
    }else{
        //instantiate book
        const book =new Book(title,author,isbn);
    
        //add book to UI
        UI.addBookToList(book);

        //add book to store
        Store.addBook(book);

        //show success message
        UI.showAlert('Book Added','success');

        //clear field
        UI.clearFields();

    }
    
});
//Event : remove a books
document.querySelector('#book-list').addEventListener('click',(e)=>{
    //remove book from UI
    UI.deleteBook(e.target);

    //remove book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    UI.showAlert('Book Deleted','success');
});