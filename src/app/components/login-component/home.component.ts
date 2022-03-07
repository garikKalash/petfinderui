import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {DataService} from '../../services/data.service';
import {take, takeUntil} from 'rxjs/operators';
import {Type} from '../../models/type.model';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import {MatSelect} from '@angular/material/select';
import {PetService} from '../../services/pet.service';
import {Animal} from '../../models/animal.model';
import {PageEvent} from '@angular/material/paginator';
import {Organization} from '../../models/organization.model';

@Component({
  selector: 'app-login',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  loading = false;
  submitted = false;
  error = '';
  saveResult = false;

  location: string;

  animals: Animal[] = [];


  public typeCtrl: FormControl = new FormControl();
  public typeFilterCtrl: FormControl = new FormControl();
  types: Type[] = [];
  public filteredTypes: ReplaySubject<Type[]> = new ReplaySubject<Type[]>(1);
  @ViewChild('singleSelectType', { static: true }) singleSelectType: MatSelect;


  selectedOrgs: Organization[] = [];


  protected breeds: string[] = [];
  /** control for the selected breed for multi-selection */
  public breedMultiCtrl: FormControl = new FormControl();
  /** control for the MatSelect filter keyword multi-selection */
  public breedMultiFilterCtrl: FormControl = new FormControl();
  /** list of breeds filtered by search keyword */
  public filteredBreedsMulti: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);
  @ViewChild('multiSelectBreed', { static: true }) multiSelectBreed: MatSelect;


  protected colors: string[] = [];
  public colorMultiCtrl: FormControl = new FormControl();
  public colorMultiFilterCtrl: FormControl = new FormControl();
  public filteredColorsMulti: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);
  @ViewChild('multiSelectColor', { static: true }) multiSelectColor: MatSelect;


  protected statuses: string[] = ['adoptable', 'adopted', 'found'];
  public statusMultiCtrl: FormControl = new FormControl();
  public statusMultiFilterCtrl: FormControl = new FormControl();
  public filteredStatusesMulti: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);
  @ViewChild('multiSelectStatus', { static: true }) multiSelectStatus: MatSelect;
  selectedStatuses: string[] = [];


  protected coats: string[] = [];
  public coatMultiCtrl: FormControl = new FormControl();
  public coatMultiFilterCtrl: FormControl = new FormControl();
  public filteredCoatsMulti: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);
  @ViewChild('multiSelectCoat', { static: true }) multiSelectCoat: MatSelect;


  protected genders: string[] = [];
  public genderMultiCtrl: FormControl = new FormControl();
  public genderMultiFilterCtrl: FormControl = new FormControl();
  public filteredGendersMulti: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);
  @ViewChild('multiSelectGender', { static: true }) multiSelectGender: MatSelect;


  protected orgs: Organization[] = [];
  public orgMultiCtrl: FormControl = new FormControl();
  public orgMultiFilterCtrl: FormControl = new FormControl();
  public filteredOrgsMulti: ReplaySubject<Organization[]> = new ReplaySubject<Organization[]>(1);
  @ViewChild('multiSelectOrg', { static: true }) multiSelectOrg: MatSelect;

  filteredOptions: Observable<Type[]>;
  selectedType: Type;
  selectedBreeds: string[];
  selectedCoats: string[];
  selectedColors: string[];
  selectedGenders: string[];


  constructor(private dataService: DataService,
              private petService: PetService) {

  }

  /** Subject that emits when the component has been destroyed. */
    // tslint:disable-next-line:variable-name
  protected _onDestroy = new Subject<void>();


  ngOnInit() {
    this.dataService.organizations().subscribe(orgs => {
      this.orgs = orgs;
      this.filteredOrgsMulti.next(this.orgs.slice());
      // listen for search field value changes
      this.orgMultiFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterOrgsMulti();
        });
    });

    this.dataService.types().subscribe(types => {
      this.types = types;
      // set initial selection
      this.typeCtrl.setValue(this.types[0]);
      // load the initial bank list
      this.filteredTypes.next(this.types.slice());
      // listen for search field value changes
      this.typeFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterTypes();
        });
      this.singleSelectType.valueChange.subscribe(value => {
        this.selectedType = value;
        this.setOtherForms();
        this.selectedColors = [];
        this.selectedCoats = [];
        this.selectedGenders = [];
        this.selectedBreeds = [];
      });
      this.setOtherForms();
    });
  }

  setOtherForms() {
    console.log(this.selectedType);
    this.breeds = this.selectedType.breeds;
    this.colors = this.selectedType.colors;
    this.genders = this.selectedType.genders;
    this.coats = this.selectedType.coats;
    // set initial selection
    // load the initial bank list
    this.filteredBreedsMulti.next(this.breeds.slice());
    // listen for search field value changes
    this.breedMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBreedsMulti();
      });

    // load the initial bank list
    this.filteredColorsMulti.next(this.colors.slice());
    // listen for search field value changes
    this.colorMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterColorsMulti();
      });

    // load the initial bank list
    this.filteredCoatsMulti.next(this.coats.slice());
    // listen for search field value changes
    this.coatMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCoatsMulti();
      });

    // load the initial bank list
    this.filteredStatusesMulti.next(this.statuses.slice());
    // listen for search field value changes
    this.statusMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterStatusesMulti();
      });

    // load the initial bank list
    this.filteredGendersMulti.next(this.genders.slice());
    // listen for search field value changes
    this.genderMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterGendersMulti();
      });
  }


  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  /**
   * Sets the initial value after the filteredBanks are loaded initially
   */
  protected setInitialValue() {
    this.filteredTypes
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.singleSelectType.compareWith = (a: Type, b: Type) => a && b && a.name === b.name;
      });
    this.filteredBreedsMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.multiSelectBreed.compareWith = (a: string, b: string) => a && b && a === b;
      });
    this.filteredOrgsMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.multiSelectOrg.compareWith = (a: Organization, b: Organization) => a && b && a.name === b.name;
      });
    this.filteredColorsMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.multiSelectColor.compareWith = (a: string, b: string) => a && b && a === b;
      });
    this.filteredCoatsMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.multiSelectCoat.compareWith = (a: string, b: string) => a && b && a === b;
      });
    this.filteredGendersMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.multiSelectGender.compareWith = (a: string, b: string) => a && b && a === b;
      });
  }

  protected filterTypes() {
    if (!this.types) {
      return;
    }
    // get the search keyword
    let search = this.typeFilterCtrl.value;
    if (!search) {
      this.filteredTypes.next(this.types.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredTypes.next(
      this.types.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterBreedsMulti() {
    if (!this.breeds) {
      return;
    }
    // get the search keyword
    let search = this.breedMultiFilterCtrl.value;
    if (!search) {
      this.filteredBreedsMulti.next(this.breeds.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredBreedsMulti.next(
      this.breeds.filter(bank => bank.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterOrgsMulti() {
    if (!this.orgs) {
      return;
    }
    // get the search keyword
    let search = this.orgMultiFilterCtrl.value;
    if (!search) {
      this.filteredOrgsMulti.next(this.orgs.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredOrgsMulti.next(
      this.orgs.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterColorsMulti() {
    if (!this.colors) {
      return;
    }
    // get the search keyword
    let search = this.colorMultiFilterCtrl.value;
    if (!search) {
      this.filteredColorsMulti.next(this.colors.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredColorsMulti.next(
      this.colors.filter(bank => bank.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterCoatsMulti() {
    if (!this.coats) {
      return;
    }
    // get the search keyword
    let search = this.coatMultiFilterCtrl.value;
    if (!search) {
      this.filteredCoatsMulti.next(this.coats.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredCoatsMulti.next(
      this.coats.filter(bank => bank.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterStatusesMulti() {
    if (!this.statuses) {
      return;
    }
    // get the search keyword
    let search = this.statusMultiFilterCtrl.value;
    if (!search) {
      this.filteredStatusesMulti.next(this.statuses.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredStatusesMulti.next(
      this.statuses.filter(bank => bank.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterGendersMulti() {
    if (!this.genders) {
      return;
    }
    // get the search keyword
    let search = this.genderMultiFilterCtrl.value;
    if (!search) {
      this.filteredGendersMulti.next(this.genders.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredGendersMulti.next(
      this.genders.filter(bank => bank.toLowerCase().indexOf(search) > -1)
    );
  }

  search(){
    this.error = '';
    this.saveResult = false;
    this.petService.search(this.selectedType.name,
      this.selectedBreeds, this.selectedGenders, this.selectedCoats, this.selectedColors,
      this.location, this.selectedOrgs, this.selectedStatuses)
      .subscribe(data => {
        this.animals = data;
        this.saveResult = true;
      }, error1 => {
        this.error = error1.error.msg;
        this.saveResult = false;
      });
  }

}
