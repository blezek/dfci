# Processing ADNI with pyradiomics

[Downloaded ADNI data](http://adni.loni.usc.edu/data-samples/access-data/) in multiple chunks.  Extracting [using 7zip](http://www.7-zip.org/) because the ZIP format is newer than the Unarchiver (for shame) and 7zip allows to merge.

```
cd ~/Data/ADNI
cd ..
for i in {1..10}; do
  7z x -y ~/Downloads/radiomics_$i.zip
done

```

# Data

The ADNI data are organized as `Subject/Type/Date/Series/Data`.

* **Subject** is the id of each subject `XXX_T_YYYY`, `XXX` - site, `T` - type Patient, Volunteer or Subject, `YYYY` - number
* **Type** indicates the type of data, e.g. `Hippocampal_Mask`, `MP-RAGE`, etc.
* **Date**  gives date down to fractions of a second, `2007-06-05_11_20_17.0`
* **Series** series number, seemingly not correlated between segmentation and data
* **Data** DICOM or `.nii` files

## Create a catalog

```
cd /Volumes/External/ADNI

sqlite3 adni.db <<EOF
create table if not exists adni (
  subject text,
  type text,
  date text,
  series text,
  unique(subject,type,date,series)
);
EOF

# insert depth 4 directories, first creating a CSV file
# Helped by https://stackoverflow.com/questions/9899001/how-to-escape-single-quote-in-awk-inside-printf

# Clean up the odd filename with a comma, eg 002_S_1070/MP-RAGE_REPEAT/MAPER_segmentation,_masked/
for fid in */MAPER_segmentation,_masked; do
  mv $fid ${fid/,_/_}
done

find . -type d -depth 4 | \
    awk -F/ -v OFS=',' '{print $2, $3, $4, $5}' > adni.csv

sqlite3 adni.db <<EOF
delete from adni;
.separator ","
.import adni.csv adni
EOF


find . -type d -depth 4 | \
    awk -F/ '{printf "insert or ignore into adni (subject, type, date, series) values ( '\''%s'\'', '\''%s'\'', '\''%s'\'', '\''%s'\'');\n", $2, $3, $4, $5}' | \
    sqlite3 adni.db
```


```
# Some files were extracted in ADNI/ADNI, merge
cd /Volumes/External/ADNI/ADNI
for dir in *; do
    mv $dir/* ../$dir/*
    rmdir $dir
    echo $dir
done


# Clinical data

Download the `ADNIMERGE.csv`.  It contains all the relevant variables to understand the ADNI data.


# Figure out the dumb orientation!


Can use fslreorient2std, fslswapdim to help...

```
H=/Volumes/External/ADNI/002_S_0295/Hippocampal_Mask/2006-04-18_08_20_30.0/S13408/ADNI_002_S_0295_MR_Hippocampal_Mask_Hi_20080228111448800_S13408_I93328.nii

M=/Volumes/External/ADNI/002_S_0295/MP-RAGE/2006-04-18_08_20_30.0/S13408/ADNI_002_S_0295_MR_MP-RAGE__br_raw_20060418193713091_1_S13408_I13722.nii


# Working!
c3d $M -origin 0x0x0mm -o M.nii.gz

gzip -c $H > H_orig.nii.gz
fslorient -forceneurological H_orig.nii.gz 
fslswapdim H_orig.nii.gz -z -y -x H_test.nii.gz
c3d H_test.nii.gz -origin 0x0x0mm -o H.nii.gz

overlay 1 1 M.nii.gz -a H.nii.gz 20 21 overlay.nii.gz

slices overlay.nii.gz -o test.png -s 2


fsleyes M.nii.gz H.nii.gz


```
