package com.butcrm.modules.callhistory;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import java.util.Date;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import android.app.Activity;
import android.content.ContentResolver;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.provider.CallLog;
import android.provider.ContactsContract;

public class CallHistoryModule extends ReactContextBaseJavaModule {
    private Activity activity = null;

    public CallHistoryModule(ReactApplicationContext reactContext, Activity activity) {
        super(reactContext);
        this.activity = activity;
    }

    @Override
    public String getName() {
        return "CallHistoryAndroid";
    }

    @ReactMethod
    public void getAll(int limit, Callback successCallback) {
        Cursor managedCursor = activity.managedQuery(CallLog.Calls.CONTENT_URI, null,
                null, null, CallLog.Calls.DATE + " DESC LIMIT " + limit);
        WritableArray data = cursorToWritableArray(managedCursor);

        successCallback.invoke(data);
    }

    @ReactMethod
    public void getKnownCalls(int limit, Callback successCallback) {
        Cursor managedCursor = activity.managedQuery(CallLog.Calls.CONTENT_URI, null,
                null, null, CallLog.Calls.DATE + " DESC LIMIT " + limit);

        Set<String> phones = new HashSet<>();
        ContentResolver resolver = activity.getContentResolver();
        WritableArray data = Arguments.createArray();

        int number = managedCursor.getColumnIndex(CallLog.Calls.NUMBER);
        int type = managedCursor.getColumnIndex(CallLog.Calls.TYPE);
        int date = managedCursor.getColumnIndex(CallLog.Calls.DATE);
        int duration = managedCursor.getColumnIndex(CallLog.Calls.DURATION);

        while (managedCursor.moveToNext()) {
            String phNumber = managedCursor.getString(number);

            if (phones.contains(phNumber)) {
                continue;
            }

            phones.add(phNumber);

            Uri uri = Uri.withAppendedPath(ContactsContract.PhoneLookup.CONTENT_FILTER_URI, Uri.encode(phNumber));
            Cursor c = resolver.query(uri, null, null, null, null);
            if (c == null) {
                continue;
            }

            if (c.moveToFirst()) {
//                String contactId = c.getString(c.getColumnIndex(ContactsContract.PhoneLookup._ID));
                String name =      c.getString(c.getColumnIndex(ContactsContract.PhoneLookup.DISPLAY_NAME));

                String callType = managedCursor.getString(type);
                String callDate = managedCursor.getString(date);
                Date callDayTime = new Date(Long.valueOf(callDate));
                String callDuration = managedCursor.getString(duration);
                String dir = null;
                int dircode = Integer.parseInt(callType);
                WritableMap call = Arguments.createMap();
                switch (dircode) {
                    case CallLog.Calls.OUTGOING_TYPE:
                        dir = "OUTGOING";
                        break;

                    case CallLog.Calls.INCOMING_TYPE:
                        dir = "INCOMING";
                        break;

                    case CallLog.Calls.MISSED_TYPE:
                        dir = "MISSED";
                        break;
                }

                call.putString("name", name);
                call.putString("phone", phNumber);
                call.putString("type", dir);
                call.putString("date", callDayTime.toString());
                call.putString("duration", callDuration);

                data.pushMap(call);
            }
        }

        successCallback.invoke(data);
    }

    @ReactMethod
    public void getUnknownCalls(int limit, Callback successCallback) {
        String selection = CallLog.Calls.CACHED_NAME + " IS NULL";
        Cursor managedCursor = activity.managedQuery(CallLog.Calls.CONTENT_URI, null,
                selection, null, CallLog.Calls.DATE + " DESC LIMIT " + limit);

        Set<String> phones = new HashSet<>();
        ContentResolver resolver = activity.getContentResolver();
        WritableArray data = Arguments.createArray();

        int number = managedCursor.getColumnIndex(CallLog.Calls.NUMBER);
        int type = managedCursor.getColumnIndex(CallLog.Calls.TYPE);
        int date = managedCursor.getColumnIndex(CallLog.Calls.DATE);
        int duration = managedCursor.getColumnIndex(CallLog.Calls.DURATION);

        while (managedCursor.moveToNext()) {
            String phNumber = managedCursor.getString(number);

            if (phones.contains(phNumber)) {
                continue;
            }

            phones.add(phNumber);

            Uri uri = Uri.withAppendedPath(ContactsContract.PhoneLookup.CONTENT_FILTER_URI, Uri.encode(phNumber));
            Cursor c = resolver.query(uri, null, null, null, null);
            String name = null;
            if (c.moveToFirst()) {
                name = c.getString(c.getColumnIndex(ContactsContract.PhoneLookup.DISPLAY_NAME));
            }

            if (name == null || name.trim().equals("")) {
                String callType = managedCursor.getString(type);
                String callDate = managedCursor.getString(date);
                Date callDayTime = new Date(Long.valueOf(callDate));
                String callDuration = managedCursor.getString(duration);
                String dir = null;
                int dircode = Integer.parseInt(callType);
                WritableMap call = Arguments.createMap();
                switch (dircode) {
                    case CallLog.Calls.OUTGOING_TYPE:
                        dir = "OUTGOING";
                        break;

                    case CallLog.Calls.INCOMING_TYPE:
                        dir = "INCOMING";
                        break;

                    case CallLog.Calls.MISSED_TYPE:
                        dir = "MISSED";
                        break;
                }

                call.putString("phone", phNumber);
                call.putString("type", dir);
                call.putString("date", callDayTime.toString());
                call.putString("duration", callDuration);

                data.pushMap(call);
            }
        }

        successCallback.invoke(data);
    }

    private WritableMap parseRecord(Cursor managedCursor) {
        int number = managedCursor.getColumnIndex(CallLog.Calls.NUMBER);
        int type = managedCursor.getColumnIndex(CallLog.Calls.TYPE);
        int date = managedCursor.getColumnIndex(CallLog.Calls.DATE);
        int duration = managedCursor.getColumnIndex(CallLog.Calls.DURATION);
        int cacheNameCol = managedCursor.getColumnIndex(CallLog.Calls.CACHED_NAME);

        String cacheName = managedCursor.getString(cacheNameCol);
        String phNumber = managedCursor.getString(number);
        String callType = managedCursor.getString(type);
        String callDate = managedCursor.getString(date);
        Date callDayTime = new Date(Long.valueOf(callDate));
        String callDuration = managedCursor.getString(duration);
        String dir = null;
        int dircode = Integer.parseInt(callType);
        WritableMap call = Arguments.createMap();
        switch (dircode) {
            case CallLog.Calls.OUTGOING_TYPE:
                dir = "OUTGOING";
                break;

            case CallLog.Calls.INCOMING_TYPE:
                dir = "INCOMING";
                break;

            case CallLog.Calls.MISSED_TYPE:
                dir = "MISSED";
                break;
        }

        call.putString("cache_name", cacheName);
        call.putString("phone", phNumber);
        call.putString("type", dir);
        call.putString("date", callDayTime.toString());
        call.putString("duration", callDuration);

        return call;
    }

    private WritableArray cursorToWritableArray(Cursor managedCursor) {
        int number = managedCursor.getColumnIndex(CallLog.Calls.NUMBER);
        int type = managedCursor.getColumnIndex(CallLog.Calls.TYPE);
        int date = managedCursor.getColumnIndex(CallLog.Calls.DATE);
        int duration = managedCursor.getColumnIndex(CallLog.Calls.DURATION);
        int cacheNameCol = managedCursor.getColumnIndex(CallLog.Calls.CACHED_NAME);
        WritableArray data = Arguments.createArray();

        while (managedCursor.moveToNext()) {
            String cacheName = managedCursor.getString(cacheNameCol);
            String phNumber = managedCursor.getString(number);
            String callType = managedCursor.getString(type);
            String callDate = managedCursor.getString(date);
            Date callDayTime = new Date(Long.valueOf(callDate));
            String callDuration = managedCursor.getString(duration);
            String dir = null;
            int dircode = Integer.parseInt(callType);
            WritableMap call = Arguments.createMap();
            switch (dircode) {
                case CallLog.Calls.OUTGOING_TYPE:
                    dir = "OUTGOING";
                    break;

                case CallLog.Calls.INCOMING_TYPE:
                    dir = "INCOMING";
                    break;

                case CallLog.Calls.MISSED_TYPE:
                    dir = "MISSED";
                    break;
            }

            call.putString("cache_name", cacheName);
            call.putString("phone", phNumber);
            call.putString("type", dir);
            call.putString("date", callDayTime.toString());
            call.putString("duration", callDuration);

            data.pushMap(call);
        }

        return data;
    }

}
